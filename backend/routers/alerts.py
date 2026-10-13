import time
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.database import AlertModel, get_db
from ..schemas.schemas import AlertCreate, AlertResponse
from .ws import ws_manager

router = APIRouter(prefix="/alerts", tags=["Safety Alerts & SOS"])

@router.get("", response_model=List[dict])
async def get_all_alerts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AlertModel).order_by(AlertModel.id.desc()))
    alerts = result.scalars().all()
    return [
        {
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "severity": a.severity,
            "busNumber": a.bus_number,
            "timestamp": a.timestamp,
            "type": a.type,
            "resolved": a.resolved,
        }
        for a in alerts
    ]

import uuid

# In-memory cooldown cache: (title, bus_number, type) -> last_timestamp
_recent_alerts_cache = {}

@router.post("/broadcast")
async def broadcast_alert(alert: AlertCreate, db: AsyncSession = Depends(get_db)):
    now_ts = time.time()
    dedup_key = (alert.title.strip(), (alert.busNumber or "").strip(), alert.type)

    # If an identical alert was broadcasted within the last 10 seconds, skip duplicate DB insert and return
    if dedup_key in _recent_alerts_cache and (now_ts - _recent_alerts_cache[dedup_key]) < 10:
        return {
            "id": f"cached-{int(now_ts)}",
            "title": alert.title,
            "description": alert.description,
            "severity": alert.severity,
            "busNumber": alert.busNumber,
            "timestamp": alert.timestamp or time.strftime("%I:%M %p"),
            "type": alert.type,
            "resolved": False,
        }

    _recent_alerts_cache[dedup_key] = now_ts

    alert_id = f"alt-{int(time.time()*1000)}-{uuid.uuid4().hex[:6]}"
    time_str = alert.timestamp or time.strftime("%I:%M %p")

    new_alert = AlertModel(
        id=alert_id,
        title=alert.title,
        description=alert.description,
        severity=alert.severity,
        bus_number=alert.busNumber,
        timestamp=time_str,
        type=alert.type,
        resolved=False,
    )
    db.add(new_alert)
    await db.commit()

    alert_dict = {
        "id": new_alert.id,
        "title": new_alert.title,
        "description": new_alert.description,
        "severity": new_alert.severity,
        "busNumber": new_alert.bus_number,
        "timestamp": new_alert.timestamp,
        "type": new_alert.type,
        "resolved": new_alert.resolved,
    }

    # Instant Real-time WebSocket Broadcast
    try:
        await ws_manager.broadcast_all({
            "type": "SAFETY_ALERT",
            "title": alert_dict["title"],
            "busNumber": alert_dict.get("busNumber"),
            "severity": alert_dict.get("severity"),
            "data": alert_dict,
        })
    except Exception as e:
        print(f"[WebSocket Alert Broadcast Error]: {e}")

    return alert_dict

@router.put("/{alert_id}/resolve")
async def resolve_alert(alert_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AlertModel).filter(AlertModel.id == alert_id))
    alert = res.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.resolved = True
    await db.commit()
    return {"success": True, "alertId": alert_id, "resolved": True}
