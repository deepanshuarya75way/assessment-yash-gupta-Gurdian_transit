import json
import time
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.database import RouteModel, get_db

router = APIRouter(prefix="/routes", tags=["Routes"])

@router.get("", response_model=List[dict])
async def get_all_routes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RouteModel))
    routes = result.scalars().all()
    out = []
    for r in routes:
        raw_stops = json.loads(r.stops) if r.stops else []
        normalized_stops = []
        for idx, s in enumerate(raw_stops):
            if isinstance(s, dict):
                normalized_stops.append({
                    "id": s.get("id", f"st-{idx+1}"),
                    "name": s.get("name", f"Stop #{idx+1}"),
                    "morningTime": s.get("morningTime", s.get("time", "07:30 AM")),
                    "eveningTime": s.get("eveningTime", "02:30 PM"),
                    "studentCount": s.get("studentCount", s.get("studentsBoardingCount", 8)),
                })
            else:
                normalized_stops.append({
                    "id": f"st-{idx+1}",
                    "name": str(s),
                    "morningTime": "07:30 AM",
                    "eveningTime": "02:30 PM",
                    "studentCount": 8,
                })

        out.append({
            "id": r.id,
            "routeName": r.name,
            "name": r.name,
            "startPoint": r.start_destination.split("➔")[0].strip() if "➔" in r.start_destination else "Terminal",
            "endPoint": r.start_destination.split("➔")[1].strip() if "➔" in r.start_destination else "Apex Central Campus Hub",
            "startDestination": r.start_destination,
            "totalDistance": "14.5 km",
            "estimatedTime": "35 mins",
            "assignedBusId": r.assigned_bus_id,
            "assignedBusNumber": r.assigned_bus_number,
            "totalStops": r.total_stops,
            "activeStudentsCount": r.active_students_count,
            "stops": normalized_stops,
        })
    return out

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_route(route_data: dict, db: AsyncSession = Depends(get_db)):
    route_id = route_data.get("id") or f"rt-{int(time.time())}"
    route_name = route_data.get("routeName") or route_data.get("name") or "New Route"
    start_dest = f"{route_data.get('startPoint', 'Origin')} ➔ {route_data.get('endPoint', 'Apex Central Campus')}"
    
    new_route = RouteModel(
        id=route_id,
        name=route_name,
        start_destination=start_dest,
        assigned_bus_id=route_data.get("assignedBusId", "bus-01"),
        assigned_bus_number=route_data.get("assignedBusNumber", "Bus #12"),
        total_stops=len(route_data.get("stops", [])),
        active_students_count=30,
        stops=json.dumps(route_data.get("stops", [])),
    )
    db.add(new_route)
    await db.commit()
    await db.refresh(new_route)
    return {"message": "Route created successfully", "id": new_route.id}

@router.delete("/{route_id}")
async def delete_route(route_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(RouteModel).filter(RouteModel.id == route_id))
    route = res.scalar_one_or_none()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    await db.delete(route)
    await db.commit()
    return {"message": f"Route {route_id} deleted successfully"}
