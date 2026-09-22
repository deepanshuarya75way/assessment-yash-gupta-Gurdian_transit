import json
import time
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, update
from ..models.database import ParentModel, StudentModel, get_db
from ..schemas.schemas import ParentCreate, ParentResponse, ParentBase

router = APIRouter(prefix="/parents", tags=["Parents"])

@router.get("", response_model=List[dict])
async def get_all_parents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ParentModel))
    parents = result.scalars().all()
    out = []
    for p in parents:
        stored_ids = json.loads(p.linked_student_ids) if p.linked_student_ids else []
        
        # Single Source of Truth: Find all students belonging to this parent
        filter_conditions = [
            StudentModel.parent_id == p.id,
            StudentModel.parent_name == p.name
        ]
        if stored_ids:
            filter_conditions.append(StudentModel.id.in_(stored_ids))
            
        stud_res = await db.execute(select(StudentModel).filter(or_(*filter_conditions)))
        students = stud_res.scalars().all()

        student_ids = [s.id for s in students]
        student_names = [s.name for s in students]

        out.append({
            "id": p.id,
            "name": p.name,
            "relation": p.relation,
            "email": p.email,
            "phone": p.phone,
            "address": p.address,
            "emergencyContact": p.emergency_contact,
            "occupation": p.occupation,
            "linkedStudentIds": student_ids,
            "linkedStudentNames": student_names,
        })
    return out

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_parent(parent: ParentCreate, db: AsyncSession = Depends(get_db)):
    parent_id = parent.id or f"par-{int(time.time())}"
    student_ids = parent.linkedStudentIds or []

    res = await db.execute(
        select(ParentModel).filter(
            or_(ParentModel.id == parent_id, ParentModel.name == parent.name)
        )
    )
    existing = res.scalar_one_or_none()

    if existing:
        existing.name = parent.name
        existing.relation = parent.relation
        existing.email = parent.email
        existing.phone = parent.phone
        existing.address = parent.address
        existing.emergency_contact = parent.emergencyContact
        existing.occupation = parent.occupation
        existing.linked_student_ids = json.dumps(student_ids)
        new_parent = existing
    else:
        new_parent = ParentModel(
            id=parent_id,
            name=parent.name,
            relation=parent.relation,
            email=parent.email,
            phone=parent.phone,
            address=parent.address,
            emergency_contact=parent.emergencyContact,
            occupation=parent.occupation,
            linked_student_ids=json.dumps(student_ids),
        )
        db.add(new_parent)

    # Update all linked students to point to this parent
    if student_ids:
        await db.execute(
            update(StudentModel)
            .filter(StudentModel.id.in_(student_ids))
            .values(
                parent_id=new_parent.id,
                parent_name=new_parent.name,
                parent_phone=new_parent.phone,
            )
        )

    await db.commit()
    await db.refresh(new_parent)

    filter_conditions = [
        StudentModel.parent_id == new_parent.id,
        StudentModel.parent_name == new_parent.name
    ]
    if student_ids:
        filter_conditions.append(StudentModel.id.in_(student_ids))
        
    stud_res = await db.execute(select(StudentModel).filter(or_(*filter_conditions)))
    students = stud_res.scalars().all()
    
    return {
        "id": new_parent.id,
        "name": new_parent.name,
        "relation": new_parent.relation,
        "email": new_parent.email,
        "phone": new_parent.phone,
        "address": new_parent.address,
        "emergencyContact": new_parent.emergency_contact,
        "occupation": new_parent.occupation,
        "linkedStudentIds": [s.id for s in students],
        "linkedStudentNames": [s.name for s in students],
    }

@router.delete("/{parent_id}")
async def delete_parent(parent_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(ParentModel).filter(ParentModel.id == parent_id))
    parent = res.scalar_one_or_none()
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    await db.delete(parent)
    await db.commit()
    return {"message": f"Parent {parent_id} deleted successfully"}
