import json
import time
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from ..models.database import StudentModel, ParentModel, get_db
from ..schemas.schemas import StudentCreate, StudentResponse

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("", response_model=List[dict])
async def get_all_students(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudentModel))
    students = result.scalars().all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "rollNo": s.roll_no,
            "grade": s.grade,
            "section": s.section,
            "address": s.address,
            "busId": s.bus_id,
            "busNumber": s.bus_number,
            "routeName": s.route_name,
            "parentId": s.parent_id,
            "parentName": s.parent_name,
            "parentPhone": s.parent_phone,
            "status": s.status,
            "lastCheckin": s.last_checkin,
            "avatarUrl": s.avatar_url,
            "faceRegistered": s.face_registered,
        }
        for s in students
    ]

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_student(student: StudentCreate, db: AsyncSession = Depends(get_db)):
    student_id = student.id or f"stu-{int(time.time())}"

    stmt = select(StudentModel).filter(
        or_(StudentModel.id == student_id, StudentModel.roll_no == student.rollNo)
    )
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        existing.name = student.name
        existing.roll_no = student.rollNo
        existing.grade = student.grade
        existing.section = student.section
        existing.address = student.address
        existing.bus_id = student.busId
        existing.bus_number = student.busNumber
        existing.route_name = student.routeName
        existing.parent_id = student.parentId
        existing.parent_name = student.parentName
        existing.parent_phone = student.parentPhone
        existing.avatar_url = student.avatarUrl
        if student.faceVector:
            existing.face_vector = json.dumps(student.faceVector)
        db_student = existing
    else:
        db_student = StudentModel(
            id=student_id,
            name=student.name,
            roll_no=student.rollNo,
            grade=student.grade,
            section=student.section,
            address=student.address,
            bus_id=student.busId,
            bus_number=student.busNumber,
            route_name=student.routeName,
            parent_id=student.parentId,
            parent_name=student.parentName,
            parent_phone=student.parentPhone,
            status="WAITING",
            last_checkin="Just Enrolled",
            avatar_url=student.avatarUrl,
            face_registered=True,
            face_vector=json.dumps(student.faceVector) if student.faceVector else None,
        )
        db.add(db_student)

    # Sync with Parent record
    parent = None
    if student.parentId:
        parent_stmt = select(ParentModel).filter(ParentModel.id == student.parentId)
        parent_res = await db.execute(parent_stmt)
        parent = parent_res.scalar_one_or_none()

    if not parent and student.parentName and student.parentName.strip() and student.parentName != "No Parent Assigned":
        parent_stmt = select(ParentModel).filter(ParentModel.name.ilike(student.parentName.strip()))
        parent_res = await db.execute(parent_stmt)
        parent = parent_res.scalar_one_or_none()

    if parent:
        db_student.parent_id = parent.id
        db_student.parent_name = parent.name
        if not db_student.parent_phone:
            db_student.parent_phone = parent.phone
        current_linked = json.loads(parent.linked_student_ids) if parent.linked_student_ids else []
        if db_student.id not in current_linked:
            current_linked.append(db_student.id)
            parent.linked_student_ids = json.dumps(current_linked)
    elif student.parentName and student.parentName.strip() and student.parentName != "No Parent Assigned":
        # Create parent if new
        new_parent_id = student.parentId or f"par-{int(time.time())}"
        new_parent = ParentModel(
            id=new_parent_id,
            name=student.parentName.strip(),
            relation="Father",
            email=f"{student.parentName.strip().lower().replace(' ', '.')}@example.com",
            phone=student.parentPhone or "+91 98765 43210",
            address=student.address or "Delhi NCR",
            emergency_contact=student.parentPhone or "+91 98765 43210",
            occupation="Guardian",
            linked_student_ids=json.dumps([db_student.id]),
            password="parent123",
        )
        db.add(new_parent)
        db_student.parent_id = new_parent.id

    await db.commit()
    await db.refresh(db_student)

    return {
        "id": db_student.id,
        "name": db_student.name,
        "rollNo": db_student.roll_no,
        "grade": db_student.grade,
        "section": db_student.section,
        "address": db_student.address,
        "busId": db_student.bus_id,
        "busNumber": db_student.bus_number,
        "routeName": db_student.route_name,
        "parentId": db_student.parent_id,
        "parentName": db_student.parent_name,
        "parentPhone": db_student.parent_phone,
        "status": db_student.status,
        "lastCheckin": db_student.last_checkin,
        "avatarUrl": db_student.avatar_url,
        "faceRegistered": db_student.face_registered,
    }

@router.put(f"/{student_id}")
async def update_student(
    student_id: str,
    student: StudentCreate,
    db: AsynSession = Depends(get_db),
):
    result = await db.execute(
        select(StudentModel).where(StudentModel.id == student_id)
    )
    existing = result.scalar_one_or_name()

    if not existing:
        raise HTTPException(status_code = 404, detail = "student not found")
    
    existing.name = student.name
    existing.roll_no = student.rollNo
    existing.grade = student.grade
    existing.section = student.section
    existing.address = student.address
    existing.bus_id = student.busId
    existing.bus_number = student.busNumber
    existing.route_name = student.routeName
    existing.parent_id = student.parentId
    existing.parent_name = student.parentName
    existing.parent_phone = student.parentPhone
    existing.avatar_url = student.avatarUrl

    if student.faceVector:
        existing.face_vector = json.dumps(student.faceVector)

    await db.commit()
    await.db.refresh(existing)

    return {"message": "Student updated successfully", "id": existing.id}

    




@router.delete("/{student_id}")
async def delete_student(student_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudentModel).filter(StudentModel.id == student_id))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    await db.delete(student)
    await db.commit()
    return {"message": f"Student {student_id} deleted successfully"}
