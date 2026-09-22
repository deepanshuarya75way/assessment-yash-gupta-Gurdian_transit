import time
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.database import AttendanceModel, StudentModel, BusModel, get_db
from ..schemas.schemas import AttendanceCreate, AttendanceResponse

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.get("", response_model=List[dict])
async def get_all_attendance(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AttendanceModel).order_by(AttendanceModel.id.desc()))
    records = result.scalars().all()
    return [
        {
            "id": a.id,
            "studentId": a.student_id,
            "studentName": a.student_name,
            "rollNo": a.roll_no,
            "grade": a.grade,
            "busNumber": a.bus_number,
            "eventType": a.event_type,
            "timestamp": a.timestamp,
            "confidence": a.confidence,
            "verificationMethod": a.verification_method,
            "status": a.status,
            "photoUrl": a.photo_url,
            "shift": a.shift,
            "stopLocation": a.stop_location,
        }
        for a in records
    ]

@router.post("/verify", status_code=status.HTTP_201_CREATED)
async def record_attendance(rec: AttendanceCreate, db: AsyncSession = Depends(get_db)):
    timestamp_str = rec.timestamp or time.strftime("%I:%M %p")
    att_id = f"att-{int(time.time())}"

    new_rec = AttendanceModel(
        id=att_id,
        student_id=rec.studentId,
        student_name=rec.studentName,
        roll_no=rec.rollNo,
        grade=rec.grade,
        bus_number=rec.busNumber,
        event_type=rec.eventType,
        timestamp=timestamp_str,
        confidence=rec.confidence,
        verification_method=rec.verificationMethod,
        status="VERIFIED",
        photo_url=rec.photoUrl,
        shift=rec.shift,
        stop_location=rec.stopLocation,
    )
    db.add(new_rec)

    # Update Student status
    stud_res = await db.execute(select(StudentModel).filter(StudentModel.id == rec.studentId))
    student = stud_res.scalar_one_or_none()
    if student:
        student.status = "BOARDED" if rec.eventType == "BOARD" else "OFFBOARDED"
        student.last_checkin = timestamp_str

    # Update Bus inside counts
    bus_res = await db.execute(select(BusModel).filter(BusModel.bus_number == rec.busNumber))
    bus = bus_res.scalar_one_or_none()
    if bus:
        if rec.eventType == "BOARD":
            bus.inside_bus_count += 1
            if bus.waiting_count > 0:
                bus.waiting_count -= 1
        elif rec.eventType == "OFFBOARD":
            if bus.inside_bus_count > 0:
                bus.inside_bus_count -= 1
            bus.offboarded_count += 1

    await db.commit()

    return {
        "id": new_rec.id,
        "studentId": new_rec.student_id,
        "studentName": new_rec.student_name,
        "rollNo": new_rec.roll_no,
        "grade": new_rec.grade,
        "busNumber": new_rec.bus_number,
        "eventType": new_rec.event_type,
        "timestamp": new_rec.timestamp,
        "confidence": new_rec.confidence,
        "verificationMethod": new_rec.verification_method,
        "status": new_rec.status,
        "photoUrl": new_rec.photo_url,
        "shift": new_rec.shift,
        "stopLocation": new_rec.stop_location,
    }
