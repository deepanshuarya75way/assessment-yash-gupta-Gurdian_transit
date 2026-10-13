from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.database import BusModel, get_db
from .ws import ws_manager

router = APIRouter(prefix="/telemetry", tags=["GPS Telemetry"])

class GpsUpdatePayload(BaseModel):
    busNumber: str
    latitude: float
    longitude: float
    speed: int
    currentLocation: str

@router.post("/gps")
async def update_gps(payload: GpsUpdatePayload, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(BusModel).filter(BusModel.bus_number == payload.busNumber))
    bus = res.scalar_one_or_none()
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")

    bus.latitude = payload.latitude
    bus.longitude = payload.longitude
    bus.current_speed = payload.speed
    bus.current_location = payload.currentLocation
    await db.commit()

    telemetry_data = {
        "success": True,
        "busNumber": bus.bus_number,
        "latitude": bus.latitude,
        "longitude": bus.longitude,
        "speed": bus.current_speed,
        "location": bus.current_location,
    }

    # Broadcast live bus moving location over WebSockets
    try:
        await ws_manager.broadcast_bus_telemetry(bus.bus_number, {
            "type": "BUS_TELEMETRY",
            "data": telemetry_data,
        })
    except Exception as e:
        print(f"[WebSocket Telemetry Error]: {e}")

    return telemetry_data
