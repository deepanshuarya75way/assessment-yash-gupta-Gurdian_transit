export interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  studentIdNumber: string;
  parentName: string;
  parentPhone: string;
  assignedBus: string;
  status: "BOARDED" | "OFFBOARDED" | "WAITING";
  lastCheckinTime: string;
  avatarUrl: string;
  faceRegistered: boolean;
}

export interface Bus {
  id: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  route: string;
  currentSpeed: number; // km/h
  capacity: number;
  onboardCount: number;
  status: "ON_ROUTE" | "IDLE" | "MAINTENANCE" | "DELAYED";
  batteryFuel: number; // %
  latitude: number;
  longitude: number;
  nextStop: string;
  eta: string;
}

export interface AiRecognitionEvent {
  id: string;
  timestamp: string;
  studentName: string;
  studentId: string;
  busNumber: string;
  eventType: "BOARD" | "OFFBOARD" | "UNKNOWN";
  confidence: number;
  matchStatus: "VERIFIED_MATCH" | "UNAUTHORIZED_PERSON" | "LOW_CONFIDENCE";
  photoUrl: string;
}

export interface SafetyAlert {
  id: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "RESOLVED";
  busNumber: string;
  timestamp: string;
  type: "UNAUTHORIZED_PERSON" | "ROUTE_DEVIATION" | "OVERSPEEDING" | "SOS_TRIGGERED";
  resolved: boolean;
}

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "916fe5c0-376a-4f89-a15f-3dc5781daa24",
    name: "Yash Sharma",
    grade: "Grade 10",
    section: "A",
    studentIdNumber: "STU-10492",
    parentName: "Rajesh Sharma",
    parentPhone: "+91 98765 43210",
    assignedBus: "Bus #14 (North Route)",
    status: "BOARDED",
    lastCheckinTime: "07:42 AM",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    faceRegistered: true,
  },
  {
    id: "stu-002",
    name: "Aanya Verma",
    grade: "Grade 8",
    section: "B",
    studentIdNumber: "STU-10493",
    parentName: "Sunil Verma",
    parentPhone: "+91 98111 22334",
    assignedBus: "Bus #14 (North Route)",
    status: "BOARDED",
    lastCheckinTime: "07:45 AM",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    faceRegistered: true,
  },
  {
    id: "stu-003",
    name: "Rohan Gupta",
    grade: "Grade 11",
    section: "C",
    studentIdNumber: "STU-10494",
    parentName: "Meenakshi Gupta",
    parentPhone: "+91 98222 33445",
    assignedBus: "Bus #07 (South Express)",
    status: "WAITING",
    lastCheckinTime: "Pending",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    faceRegistered: true,
  },
  {
    id: "stu-004",
    name: "Pooja Patel",
    grade: "Grade 9",
    section: "A",
    studentIdNumber: "STU-10495",
    parentName: "Vikram Patel",
    parentPhone: "+91 98333 44556",
    assignedBus: "Bus #03 (East Corridor)",
    status: "BOARDED",
    lastCheckinTime: "07:38 AM",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    faceRegistered: true,
  },
  {
    id: "stu-005",
    name: "Kabir Mehta",
    grade: "Grade 7",
    section: "D",
    studentIdNumber: "STU-10496",
    parentName: "Anil Mehta",
    parentPhone: "+91 98444 55667",
    assignedBus: "Bus #07 (South Express)",
    status: "OFFBOARDED",
    lastCheckinTime: "08:15 AM",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    faceRegistered: false,
  },
  {
    id: "stu-006",
    name: "Simran Kaur",
    grade: "Grade 12",
    section: "A",
    studentIdNumber: "STU-10497",
    parentName: "Harpreet Kaur",
    parentPhone: "+91 98555 66778",
    assignedBus: "Bus #21 (West Metro)",
    status: "BOARDED",
    lastCheckinTime: "07:50 AM",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    faceRegistered: true,
  },
];

export const INITIAL_BUSES: Bus[] = [
  {
    id: "19d334a3-834d-446c-8be0-46bb360e5d98",
    busNumber: "Bus #14",
    driverName: "Ramesh Kumar",
    driverPhone: "+91 94567 11223",
    route: "North City → Apex School",
    currentSpeed: 42,
    capacity: 40,
    onboardCount: 28,
    status: "ON_ROUTE",
    batteryFuel: 84,
    latitude: 28.6139,
    longitude: 77.2090,
    nextStop: "Green Park Sector 4",
    eta: "4 mins",
  },
  {
    id: "bus-002",
    busNumber: "Bus #07",
    driverName: "Dalbir Singh",
    driverPhone: "+91 94567 22334",
    route: "South Ring → Apex School",
    currentSpeed: 36,
    capacity: 40,
    onboardCount: 34,
    status: "ON_ROUTE",
    batteryFuel: 72,
    latitude: 28.5355,
    longitude: 77.2410,
    nextStop: "Defence Colony Gate 2",
    eta: "7 mins",
  },
  {
    id: "bus-003",
    busNumber: "Bus #03",
    driverName: "Sanjay Dixit",
    driverPhone: "+91 94567 33445",
    route: "East Highway → Apex School",
    currentSpeed: 0,
    capacity: 40,
    onboardCount: 19,
    status: "IDLE",
    batteryFuel: 95,
    latitude: 28.6280,
    longitude: 77.2950,
    nextStop: "Preet Vihar Hub",
    eta: "Boarding Now",
  },
  {
    id: "bus-004",
    busNumber: "Bus #21",
    driverName: "Mukesh Yadav",
    driverPhone: "+91 94567 44556",
    route: "West Extension → Apex School",
    currentSpeed: 52,
    capacity: 40,
    onboardCount: 31,
    status: "DELAYED",
    batteryFuel: 61,
    latitude: 28.6400,
    longitude: 77.1200,
    nextStop: "Janakpuri Flyover",
    eta: "14 mins (Traffic)",
  },
];

export const INITIAL_AI_EVENTS: AiRecognitionEvent[] = [
  {
    id: "ai-ev-01",
    timestamp: "Just now",
    studentName: "Yash Sharma",
    studentId: "STU-10492",
    busNumber: "Bus #14",
    eventType: "BOARD",
    confidence: 99.2,
    matchStatus: "VERIFIED_MATCH",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "ai-ev-02",
    timestamp: "2 mins ago",
    studentName: "Aanya Verma",
    studentId: "STU-10493",
    busNumber: "Bus #14",
    eventType: "BOARD",
    confidence: 98.7,
    matchStatus: "VERIFIED_MATCH",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "ai-ev-03",
    timestamp: "5 mins ago",
    studentName: "Unknown Person",
    studentId: "N/A",
    busNumber: "Bus #07",
    eventType: "UNKNOWN",
    confidence: 34.1,
    matchStatus: "UNAUTHORIZED_PERSON",
    photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "ai-ev-04",
    timestamp: "8 mins ago",
    studentName: "Pooja Patel",
    studentId: "STU-10495",
    busNumber: "Bus #03",
    eventType: "BOARD",
    confidence: 99.5,
    matchStatus: "VERIFIED_MATCH",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
  },
];

export const INITIAL_ALERTS: SafetyAlert[] = [
  {
    id: "alt-01",
    title: "Unauthorized Person Attempted Boarding",
    description: "Camera scanned unrecognized biometric at Green Park stop. Cosine distance 0.74 exceeded threshold.",
    severity: "CRITICAL",
    busNumber: "Bus #07",
    timestamp: "07:51 AM",
    type: "UNAUTHORIZED_PERSON",
    resolved: false,
  },
  {
    id: "alt-02",
    title: "Route Speed Threshold Exceeded",
    description: "Bus #21 reached 56 km/h in school safety buffer zone (limit: 40 km/h).",
    severity: "HIGH",
    busNumber: "Bus #21",
    timestamp: "07:44 AM",
    type: "OVERSPEEDING",
    resolved: false,
  },
  {
    id: "alt-03",
    title: "Unscheduled Stop Duration",
    description: "Bus #03 stopped at unmapped coordinates for > 3 minutes.",
    severity: "MEDIUM",
    busNumber: "Bus #03",
    timestamp: "07:32 AM",
    type: "ROUTE_DEVIATION",
    resolved: true,
  },
];
