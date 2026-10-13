import os
import json
from typing import AsyncGenerator
from sqlalchemy import Column, String, Integer, Float, Boolean, Text
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./guardian_transit.db")

# Normalize connection string for Async SQLAlchemy
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("sqlite:///") and not DATABASE_URL.startswith("sqlite+aiosqlite:///"):
    DATABASE_URL = DATABASE_URL.replace("sqlite:///", "sqlite+aiosqlite:///", 1)

async_engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True if not DATABASE_URL.startswith("sqlite") else None,
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    pass

class StudentModel(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    roll_no = Column(String, nullable=False, unique=True, index=True)
    grade = Column(String, nullable=False)
    section = Column(String, nullable=False)
    address = Column(String, nullable=False)
    bus_id = Column(String, nullable=False)
    bus_number = Column(String, nullable=False)
    route_name = Column(String, nullable=False)
    parent_id = Column(String, nullable=False)
    parent_name = Column(String, nullable=False)
    parent_phone = Column(String, nullable=False)
    status = Column(String, default="WAITING") # BOARDED, WAITING, OFFBOARDED
    last_checkin = Column(String, default="Not Checked In")
    avatar_url = Column(String, nullable=False)
    face_registered = Column(Boolean, default=True)
    face_vector = Column(Text, nullable=True) # JSON serialized 512-D float vector

class ParentModel(Base):
    __tablename__ = "parents"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    relation = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    emergency_contact = Column(String, nullable=False)
    occupation = Column(String, nullable=False)
    linked_student_ids = Column(Text, default="[]") # JSON list
    password = Column(String, default="parent123", nullable=True) # Parent Portal Access Password


class BusModel(Base):
    __tablename__ = "buses"

    id = Column(String, primary_key=True, index=True)
    bus_number = Column(String, nullable=False, unique=True, index=True)
    license_plate = Column(String, nullable=False)
    capacity = Column(Integer, default=40)
    total_assigned_students = Column(Integer, default=30)
    inside_bus_count = Column(Integer, default=0)
    offboarded_count = Column(Integer, default=0)
    waiting_count = Column(Integer, default=0)
    driver_id = Column(String, nullable=False)
    driver_name = Column(String, nullable=False)
    driver_phone = Column(String, nullable=False)
    conductor_name = Column(String, nullable=False)
    conductor_phone = Column(String, nullable=False)
    route_id = Column(String, nullable=False)
    route_name = Column(String, nullable=False)
    current_location = Column(String, default="Main Depot")
    gps_status = Column(String, default="ONLINE")
    camera_status = Column(String, default="ONLINE")
    status = Column(String, default="ON_ROUTE")
    current_speed = Column(Integer, default=38)
    battery_fuel = Column(Integer, default=90)
    next_stop = Column(String, default="Central Campus")
    eta = Column(String, default="10 mins")
    latitude = Column(Float, default=28.6289)
    longitude = Column(Float, default=77.3649)

class RouteModel(Base):
    __tablename__ = "routes"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    start_destination = Column(String, nullable=False)
    assigned_bus_id = Column(String, nullable=False)
    assigned_bus_number = Column(String, nullable=False)
    total_stops = Column(Integer, default=4)
    active_students_count = Column(Integer, default=30)
    stops = Column(Text, default="[]") # JSON list of stops

class AttendanceModel(Base):
    __tablename__ = "attendance"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, nullable=False)
    student_name = Column(String, nullable=False)
    roll_no = Column(String, nullable=False)
    grade = Column(String, nullable=False)
    bus_number = Column(String, nullable=False)
    event_type = Column(String, nullable=False) # BOARD, OFFBOARD
    timestamp = Column(String, nullable=False)
    confidence = Column(Float, default=99.2)
    verification_method = Column(String, default="AI Face Biometrics")
    status = Column(String, default="VERIFIED")
    photo_url = Column(String, nullable=False)
    shift = Column(String, default="Morning Pickup")
    stop_location = Column(String, default="Main Station")

class AlertModel(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    severity = Column(String, default="CRITICAL") # CRITICAL, HIGH, MEDIUM
    bus_number = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)
    type = Column(String, default="UNAUTHORIZED_PERSON")
    resolved = Column(Boolean, default=False)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
