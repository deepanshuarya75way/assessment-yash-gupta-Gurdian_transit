import time
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from ..models.database import BusModel, StudentModel, RouteModel, AlertModel, get_db
from ..schemas.schemas import BusBase, BusResponse, FleetTransferRequest

router = APIRouter(prefix="/buses", tags=["Buses & Fleet"])

@router.get("", response_model=List[dict])
async def get_all_buses(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BusModel))
    buses = result.scalars().all()
    return [
        {
            "id": b.id,
            "busNumber": b.bus_number,
            "licensePlate": b.license_plate,
            "capacity": b.capacity,
            "totalAssignedStudents": b.total_assigned_students,
            "insideBusCount": b.inside_bus_count,
            "offboardedCount": b.offboarded_count,
            "waitingCount": b.waiting_count,
            "driverId": b.driver_id,
            "driverName": b.driver_name,
            "driverPhone": b.driver_phone,
            "conductorName": b.conductor_name,
            "conductorPhone": b.conductor_phone,
            "routeId": b.route_id,
            "routeName": b.route_name,
            "currentLocation": b.current_location,
            "gpsStatus": b.gps_status,
            "cameraStatus": b.camera_status,
            "status": b.status,
            "currentSpeed": b.current_speed,
            "batteryFuel": b.battery_fuel,
            "nextStop": b.next_stop,
            "eta": b.eta,
            "latitude": b.latitude,
            "longitude": b.longitude,
        }
        for b in buses
    ]

@router.post("/transfer")
async def transfer_fleet(req: FleetTransferRequest, db: AsyncSession = Depends(get_db)):
    source_res = await db.execute(select(BusModel).filter(BusModel.id == req.sourceBusId))
    source = source_res.scalar_one_or_none()

    target_res = await db.execute(select(BusModel).filter(BusModel.id == req.targetBusId))
    target = target_res.scalar_one_or_none()

    if not source or not target:
        raise HTTPException(status_code=404, detail="Source or Target Bus not found")

    # 1. Update source bus status to UNSERVICEABLE
    source.status = "UNSERVICEABLE"
    source.current_speed = 0

    # 2. Reassign students from source bus to target bus
    await db.execute(
        update(StudentModel)
        .filter(StudentModel.bus_id == source.id)
        .values(
            bus_id=target.id,
            bus_number=target.bus_number,
            route_name=target.route_name,
        )
    )

    # 3. Update target bus capacity metrics
    target.total_assigned_students += source.total_assigned_students
    target.inside_bus_count += source.inside_bus_count
    target.offboarded_count += source.offboarded_count

    # 4. Create Emergency Alert
    alert = AlertModel(
        id=f"alt-tf-{int(time.time())}",
        title="Emergency Fleet Transfer Re-routing",
        description=f"Bus {source.bus_number} unserviceable ({req.reason}). All students reassigned to {target.bus_number} (Driver: {target.driver_name}).",
        severity="MEDIUM",
        bus_number=target.bus_number,
        timestamp=time.strftime("%I:%M %p"),
        type="FLEET_TRANSFER",
        resolved=False,
    )
    db.add(alert)
    await db.commit()

    return {
        "success": True,
        "message": f"Successfully transferred route & passengers from {source.bus_number} to {target.bus_number}",
        "alertId": alert.id,
    }
