import json
from generate_and_seed import BUS_ROUTES, students_list, parents_list, attendance_list

# Generate frontend enterpriseMockData.ts

drivers_list = []
routes_list = []
for b in BUS_ROUTES:
    drivers_list.append({
        "id": b["driverId"],
        "driverId": b["driverId"].upper(),
        "name": b["driverName"],
        "phone": b["driverPhone"],
        "assignedBusId": b["id"],
        "assignedBusNumber": b["busNumber"],
        "assignedRouteName": b["routeName"],
        "licenseNumber": f"UP14-DL-{b['id'][-2:]}-2022",
        "role": "Driver",
        "experience": "8 Years",
        "experienceYears": 8,
        "rating": 4.9,
        "safetyScore": 98,
        "profilePhoto": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "status": "ACTIVE",
        "shift": "Morning & Evening",
    })
    routes_list.append({
        "id": b["routeId"],
        "routeName": b["routeName"],
        "startPoint": b["startPoint"],
        "endPoint": b["endPoint"],
        "totalDistance": b["totalDistance"],
        "estimatedTime": b["estimatedTime"],
        "assignedBusNumber": b["busNumber"],
        "stops": b["stops"],
    })

buses_frontend = []
for b in BUS_ROUTES:
    buses_frontend.append({
        "id": b["id"],
        "busNumber": b["busNumber"],
        "licensePlate": b["licensePlate"],
        "capacity": b["capacity"],
        "totalAssignedStudents": b["totalAssignedStudents"],
        "insideBusCount": b["insideBusCount"],
        "offboardedCount": b["offboardedCount"],
        "waitingCount": b["waitingCount"],
        "driverId": b["driverId"],
        "driverName": b["driverName"],
        "driverPhone": b["driverPhone"],
        "conductorName": b["conductorName"],
        "conductorPhone": b["conductorPhone"],
        "routeId": b["routeId"],
        "routeName": b["routeName"],
        "currentLocation": b["currentLocation"],
        "gpsStatus": b["gpsStatus"],
        "cameraStatus": b["cameraStatus"],
        "status": b["status"],
        "currentSpeed": b["currentSpeed"],
        "batteryFuel": b["batteryFuel"],
        "nextStop": b["nextStop"],
        "eta": b["eta"],
        "latitude": b["latitude"],
        "longitude": b["longitude"],
    })

ts_content = f'''// -------------------------------------------------------------
// ENTERPRISE DATASET: ABES Business School (Near Lal Kuan, Ghaziabad)
// 112 Students • 8 Bus Fleets • 8 Real Delhi-NCR Transit Corridors
// -------------------------------------------------------------

export interface Student {{
  id: string;
  name: string;
  rollNo: string;
  grade: string;
  section: string;
  address: string;
  busId: string;
  busNumber: string;
  routeName: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  status: "BOARDED" | "WAITING" | "OFFBOARDED";
  lastCheckin: string;
  avatarUrl: string;
  faceRegistered: boolean;
}}

export interface Parent {{
  id: string;
  name: string;
  relation: "Father" | "Mother" | "Legal Guardian" | "Relative";
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  occupation: string;
  linkedStudentIds: string[];
  linkedStudentNames: string[];
}}

export interface Bus {{
  id: string;
  busNumber: string;
  licensePlate: string;
  capacity: number;
  totalAssignedStudents: number;
  insideBusCount: number;
  offboardedCount: number;
  waitingCount: number;
  driverId: string;
  driverName: string;
  driverPhone: string;
  conductorName: string;
  conductorPhone: string;
  routeId: string;
  routeName: string;
  currentLocation: string;
  gpsStatus: "ONLINE" | "OFFLINE" | "WARNING";
  cameraStatus: "ONLINE" | "OFFLINE" | "WARNING";
  status: "ON_ROUTE" | "STANDBY" | "MAINTENANCE" | "IDLE";
  currentSpeed: number;
  batteryFuel: number;
  nextStop: string;
  eta: string;
  latitude: number;
  longitude: number;
}}

export interface Driver {{
  id: string;
  name: string;
  phone: string;
  assignedBusNumber: string;
  assignedBusId?: string;
  licenseNumber: string;
  experienceYears?: number;
  experience?: string;
  rating: number;
  safetyScore?: number;
  avatarUrl?: string;
  profilePhoto?: string;
  status: "ON_DUTY" | "OFF_DUTY" | "ON_LEAVE" | "ACTIVE" | "OFF_DUTY_STANDBY" | "ON_LEAVE_SICK";
  role?: "DRIVER" | "CONDUCTOR" | "Driver" | "Conductor";
  driverId?: string;
  assignedRouteName?: string;
  shift?: "Morning & Evening" | "Morning Pickup Only" | "Evening Dropoff Only";
}}

export interface RouteStop {{
  id: string;
  name: string;
  morningTime: string;
  eveningTime: string;
  studentCount: number;
}}

export interface Route {{
  id: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  totalDistance: string;
  estimatedTime: string;
  assignedBusNumber: string;
  stops: RouteStop[];
}}

export interface AttendanceRecord {{
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  grade: string;
  busNumber: string;
  eventType: "BOARD" | "OFFBOARD";
  timestamp: string;
  confidence: number;
  verificationMethod: "AI Face Biometrics" | "RFID Smart Card" | "Manual Override";
  status: "VERIFIED" | "FLAGGED";
  photoUrl: string;
  smsStatus?: "DELIVERED" | "DISPATCHED" | "PENDING";
  smsTime?: string;
  shift?: "Morning Pickup" | "Evening Dropoff";
  stopLocation?: string;
}}

export interface SafetyAlert {{
  id: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  busNumber: string;
  timestamp: string;
  type: "UNAUTHORIZED_PERSON" | "ROUTE_DEVIATION" | "OVERSPEEDING" | "SOS_TRIGGERED" | "DELAY" | "FLEET_TRANSFER";
  resolved: boolean;
}}

// -------------------------------------------------------------
// 112 STUDENTS • 8 BUSES • 8 CORRIDORS • 112 PARENTS (ABES GHAZIABAD)
// -------------------------------------------------------------

export const SEED_PARENTS: Parent[] = {json.dumps(parents_list, indent=2)};

export const SEED_BUSES: Bus[] = {json.dumps(buses_frontend, indent=2)};

export const SEED_DRIVERS: Driver[] = {json.dumps(drivers_list, indent=2)};

export const SEED_ROUTES: Route[] = {json.dumps(routes_list, indent=2)};

export const SEED_STUDENTS: Student[] = {json.dumps(students_list, indent=2)};

export const SEED_ATTENDANCE: AttendanceRecord[] = {json.dumps(attendance_list, indent=2)};

export const SEED_ALERTS: SafetyAlert[] = [
  {{
    id: "alt-01",
    title: "Excess Velocity Warning (NH-09 Highway)",
    description: "Bus #08 exceeded designated safety limit (55 km/h on NH-09 Expressway near Gazipur border). Conductor notified.",
    severity: "MEDIUM",
    busNumber: "Bus #08",
    timestamp: "07:42 AM",
    type: "OVERSPEEDING",
    resolved: false,
  }},
];
'''

with open("/Users/apple/Desktop/untitled folder/frontend/src/data/enterpriseMockData.ts", "w") as f:
    f.write(ts_content)

print("Updated frontend enterpriseMockData.ts with complete Driver types!")
