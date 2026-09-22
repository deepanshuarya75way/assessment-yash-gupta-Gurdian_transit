from typing import List, Optional, Any
from pydantic import BaseModel, Field

# --- STUDENT SCHEMAS ---
class StudentBase(BaseModel):
    name: str
    rollNo: str
    grade: str
    section: str = "A"
    address: str
    busId: str
    busNumber: str
    routeName: str
    parentId: str
    parentName: str
    parentPhone: str
    status: str = "WAITING"
    lastCheckin: str = "Not Checked In"
    avatarUrl: str
    faceRegistered: bool = True
    faceVector: Optional[List[float]] = None

class StudentCreate(StudentBase):
    id: Optional[str] = None

class StudentResponse(StudentBase):
    id: str

# --- PARENT SCHEMAS ---
class ParentBase(BaseModel):
    name: str
    relation: str = "Father"
    email: str = "parent@example.com"
    phone: str
    address: str = "Delhi NCR"
    emergencyContact: str = "+91 98112 34567"
    occupation: str = "Guardian"
    linkedStudentIds: List[str] = []
    linkedStudentNames: List[str] = []

class ParentCreate(ParentBase):
    id: Optional[str] = None

class ParentResponse(ParentBase):
    id: str

# --- BUS SCHEMAS ---
class BusBase(BaseModel):
    busNumber: str
    licensePlate: str
    capacity: int = 40
    totalAssignedStudents: int = 30
    insideBusCount: int = 0
    offboardedCount: int = 0
    waitingCount: int = 0
    driverId: str
    driverName: str
    driverPhone: str
    conductorName: str = "Amit Sharma"
    conductorPhone: str = "+91 94567 11229"
    routeId: str
    routeName: str
    currentLocation: str = "Central Corridor"
    gpsStatus: str = "ONLINE"
    cameraStatus: str = "ONLINE"
    status: str = "ON_ROUTE"
    currentSpeed: int = 38
    batteryFuel: int = 90
    nextStop: str = "Indirapuram Gate"
    eta: str = "8 mins"
    latitude: float = 28.6289
    longitude: float = 77.3649

class BusCreate(BusBase):
    id: Optional[str] = None

class BusResponse(BusBase):
    id: str

class FleetTransferRequest(BaseModel):
    sourceBusId: str
    targetBusId: str
    reason: str
    notifyParents: bool = True

# --- ROUTE SCHEMAS ---
class RouteStop(BaseModel):
    id: str
    name: str
    expectedTime: str
    actualTime: Optional[str] = None
    status: str = "SCHEDULED"
    studentsBoardingCount: int = 8
    coordinates: Optional[List[float]] = None

class RouteBase(BaseModel):
    name: str
    startDestination: str
    assignedBusId: str
    assignedBusNumber: str
    totalStops: int = 4
    activeStudentsCount: int = 30
    stops: List[RouteStop] = []

class RouteCreate(RouteBase):
    id: Optional[str] = None

class RouteResponse(RouteBase):
    id: str

# --- ATTENDANCE SCHEMAS ---
class AttendanceCreate(BaseModel):
    studentId: str
    studentName: str
    rollNo: str
    grade: str
    busNumber: str
    eventType: str = "BOARD" # BOARD, OFFBOARD
    timestamp: str = "07:30 AM"
    confidence: float = 99.2
    verificationMethod: str = "AI Face Biometrics"
    status: str = "VERIFIED"
    photoUrl: str
    shift: str = "Morning Pickup"
    stopLocation: str = "Indirapuram Gate"

class AttendanceResponse(AttendanceCreate):
    id: str

# --- ALERT SCHEMAS ---
class AlertCreate(BaseModel):
    title: str
    description: str
    severity: str = "CRITICAL"
    busNumber: str
    timestamp: str = "Just Now"
    type: str = "UNAUTHORIZED_PERSON"

class AlertResponse(AlertCreate):
    id: str
    resolved: bool = False

# --- TELEMETRY SCHEMAS ---
class TelemetryGpsUpdate(BaseModel):
    busId: str
    latitude: float
    longitude: float
    speed: int = 35
