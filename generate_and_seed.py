import json
import random

# Generate complete 112-student and 8-bus dataset for ABES Business School, Near Lal Kuan, Ghaziabad

BUS_ROUTES = [
    {
        "id": "bus-01",
        "busNumber": "Bus #01",
        "licensePlate": "UP 14 BT 1001",
        "capacity": 40,
        "totalAssignedStudents": 14,
        "insideBusCount": 11,
        "offboardedCount": 3,
        "waitingCount": 0,
        "driverId": "drv-01",
        "driverName": "Rajeshwar Singh",
        "driverPhone": "+91 98112 01001",
        "conductorName": "Amit Sharma",
        "conductorPhone": "+91 98112 01002",
        "routeId": "rt-01",
        "routeName": "Route 1 – Indirapuram & Vaishali",
        "startPoint": "Vaishali Metro Station",
        "endPoint": "ABES Business School (Lal Kuan)",
        "startDestination": "Vaishali Metro ➔ ABES Campus (Lal Kuan)",
        "totalDistance": "13.5 km",
        "estimatedTime": "32 mins",
        "currentLocation": "Shipra Mall Crossing, Indirapuram",
        "gpsStatus": "ONLINE",
        "cameraStatus": "ONLINE",
        "status": "ON_ROUTE",
        "currentSpeed": 38,
        "batteryFuel": 94,
        "nextStop": "CISF Camp Road",
        "eta": "4 mins",
        "latitude": 28.6380,
        "longitude": 77.3680,
        "stops": [
            {"id": "st-01-1", "name": "Vaishali Metro Station (Gate 2)", "morningTime": "07:05 AM", "eveningTime": "02:30 PM", "studentCount": 3},
            {"id": "st-01-2", "name": "Shipra Mall Crossing, Indirapuram", "morningTime": "07:20 AM", "eveningTime": "02:45 PM", "studentCount": 4},
            {"id": "st-01-3", "name": "CISF Camp Road, Ahinsa Khand", "morningTime": "07:35 AM", "eveningTime": "03:00 PM", "studentCount": 4},
            {"id": "st-01-4", "name": "ABES Business School Main Gate", "morningTime": "07:55 AM", "eveningTime": "03:20 PM", "studentCount": 3},
        ]
    },
    {
        "id": "bus-02",
        "busNumber": "Bus #02",
        "licensePlate": "UP 14 BT 1002",
        "capacity": 40,
        "totalAssignedStudents": 14,
        "insideBusCount": 10,
        "offboardedCount": 4,
        "waitingCount": 0,
        "driverId": "drv-02",
        "driverName": "Manoj Tiwari",
        "driverPhone": "+91 98112 02001",
        "conductorName": "Sanjay Verma",
        "conductorPhone": "+91 98112 02002",
        "routeId": "rt-02",
        "routeName": "Route 2 – Noida Sector 62 & Tech Zone",
        "startPoint": "Noida Electronic City Metro",
        "endPoint": "ABES Business School (Lal Kuan)",
        "startDestination": "Noida Sec 62 ➔ ABES Campus (Lal Kuan)",
        "totalDistance": "11.8 km",
        "estimatedTime": "28 mins",
        "currentLocation": "Fortis Hospital Crossing, Sector 62",
        "gpsStatus": "ONLINE",
        "cameraStatus": "ONLINE",
        "status": "ON_ROUTE",
        "currentSpeed": 40,
        "batteryFuel": 88,
        "nextStop": "Mamura Chowk Flyover",
        "eta": "6 mins",
        "latitude": 28.6250,
        "longitude": 77.3750,
        "stops": [
            {"id": "st-02-1", "name": "Noida Electronic City Metro", "morningTime": "07:10 AM", "eveningTime": "02:35 PM", "studentCount": 4},
            {"id": "st-02-2", "name": "Fortis Hospital Crossing, Sec 62", "morningTime": "07:25 AM", "eveningTime": "02:50 PM", "studentCount": 3},
            {"id": "st-02-3", "name": "Mamura Chowk Flyover", "morningTime": "07:38 AM", "eveningTime": "03:05 PM", "studentCount": 4},
            {"id": "st-02-4", "name": "ABES Business School Main Gate", "morningTime": "07:58 AM", "eveningTime": "03:25 PM", "studentCount": 3},
        ]
    },
    {
        "id": "bus-03",
        "busNumber": "Bus #03",
        "licensePlate": "UP 14 BT 1003",
        "capacity": 40,
        "totalAssignedStudents": 14,
        "insideBusCount": 12,
        "offboardedCount": 2,
        "waitingCount": 0,
        "driverId": "drv-03",
        "driverName": "Gurdeep Singh",
        "driverPhone": "+91 98112 03001",
        "conductorName": "Sunil Yadav",
        "conductorPhone": "+91 98112 03002",
        "routeId": "rt-03",
        "routeName": "Route 3 – Raj Nagar Extension & Mohan Nagar",
        "startPoint": "Mohan Nagar Temple",
        "endPoint": "ABES Business School (Lal Kuan)",
        "startDestination": "Mohan Nagar ➔ ABES Campus (Lal Kuan)",
        "totalDistance": "16.2 km",
        "estimatedTime": "38 mins",
        "currentLocation": "Raj Nagar Extn Flyover",
        "gpsStatus": "ONLINE",
        "cameraStatus": "ONLINE",
        "status": "ON_ROUTE",
        "currentSpeed": 35,
        "batteryFuel": 82,
        "nextStop": "Old Bus Stand Ghaziabad",
        "eta": "7 mins",
        "latitude": 28.6920,
        "longitude": 77.4100,
        "stops": [
            {"id": "st-03-1", "name": "Mohan Nagar Temple Metro", "morningTime": "07:00 AM", "eveningTime": "02:25 PM", "studentCount": 3},
            {"id": "st-03-2", "name": "Raj Nagar Extension Flyover", "morningTime": "07:20 AM", "eveningTime": "02:45 PM", "studentCount": 4},
            {"id": "st-03-3", "name": "Old Bus Stand, Ghaziabad", "morningTime": "07:35 AM", "eveningTime": "03:00 PM", "studentCount": 4},
            {"id": "st-03-4", "name": "ABES Business School Main Gate", "morningTime": "07:55 AM", "eveningTime": "03:20 PM", "studentCount": 3},
        ]
    },
    {
        "id": "bus-04",
        "busNumber": "Bus #04",
        "licensePlate": "UP 14 BT 1004",
        "capacity": 40,
        "totalAssignedStudents": 14,
        "insideBusCount": 9,
        "offboardedCount": 5,
        "waitingCount": 0,
        "driverId": "drv-04",
        "driverName": "Devendra Meena",
        "driverPhone": "+91 98112 04001",
        "conductorName": "Pankaj Joshi",
        "conductorPhone": "+91 98112 04002",
        "routeId": "rt-04",
        "routeName": "Route 4 – Crossings Republik & Chipiyana",
        "startPoint": "Crossings Republik Roundabout",
        "endPoint": "ABES Business School (Lal Kuan)",
        "startDestination": "Crossings Republik ➔ ABES Campus (Lal Kuan)",
        "totalDistance": "6.5 km",
        "estimatedTime": "18 mins",
        "currentLocation": "GH-7 Plaza, Crossings",
        "gpsStatus": "ONLINE",
        "cameraStatus": "ONLINE",
        "status": "ON_ROUTE",
        "currentSpeed": 30,
        "batteryFuel": 96,
        "nextStop": "Chipiyana Gate",
        "eta": "3 mins",
        "latitude": 28.6310,
        "longitude": 77.4320,
        "stops": [
            {"id": "st-04-1", "name": "Crossings Roundabout (Mahagun)", "morningTime": "07:20 AM", "eveningTime": "02:40 PM", "studentCount": 4},
            {"id": "st-04-2", "name": "GH-7 Crossings Market Plaza", "morningTime": "07:30 AM", "eveningTime": "02:50 PM", "studentCount": 4},
            {"id": "st-04-3", "name": "Chipiyana Buzurg Road Gate", "morningTime": "07:42 AM", "eveningTime": "03:05 PM", "studentCount": 3},
            {"id": "st-04-4", "name": "ABES Business School Main Gate", "morningTime": "07:55 AM", "eveningTime": "03:20 PM", "studentCount": 3},
        ]
    },
    {
        "id": "bus-05",
        "busNumber": "Bus #05",
        "licensePlate": "UP 14 BT 1005",
        "capacity": 40,
        "totalAssignedStudents": 14,
        "insideBusCount": 13,
        "offboardedCount": 1,
        "waitingCount": 0,
        "driverId": "drv-05",
        "driverName": "Surender Pal",
        "driverPhone": "+91 98112 05001",
        "conductorName": "Vipin Tomar",
        "conductorPhone": "+91 98112 05002",
        "routeId": "rt-05",
        "routeName": "Route 5 – Greater Noida West (Gaur City)",
        "startPoint": "Gaur City 1 Mall",
        "endPoint": "ABES Business School (Lal Kuan)",
        "startDestination": "Gaur City ➔ ABES Campus (Lal Kuan)",
        "totalDistance": "9.4 km",
        "estimatedTime": "24 mins",
        "currentLocation": "Char Murti Chowk, Greater Noida W",
        "gpsStatus": "ONLINE",
        "cameraStatus": "ONLINE",
        "status": "ON_ROUTE",
        "currentSpeed": 42,
        "batteryFuel": 90,
        "nextStop": "14th Avenue Gate",
        "eta": "5 mins",
        "latitude": 28.6080,
        "longitude": 77.4280,
        "stops": [
            {"id": "st-05-1", "name": "Gaur City 1 Mall Hub", "morningTime": "07:10 AM", "eveningTime": "02:35 PM", "studentCount": 4},
            {"id": "st-05-2", "name": "Char Murti Chowk Crossing", "morningTime": "07:22 AM", "eveningTime": "02:48 PM", "studentCount": 4},
            {"id": "st-05-3", "name": "Gaur City 2 (14th Avenue Gate)", "morningTime": "07:35 AM", "eveningTime": "03:00 PM", "studentCount": 3},
            {"id": "st-05-4", "name": "ABES Business School Main Gate", "morningTime": "07:55 AM", "eveningTime": "03:20 PM", "studentCount": 3},
        ]
    },
    {
        "id": "bus-06",
        "busNumber": "Bus #06",
        "licensePlate": "UP 14 BT 1006",
        "capacity": 40,
        "totalAssignedStudents": 14,
        "insideBusCount": 10,
        "offboardedCount": 4,
        "waitingCount": 0,
        "driverId": "drv-06",
        "driverName": "Harpreet Bindra",
        "driverPhone": "+91 98112 06001",
        "conductorName": "Ramesh Chandel",
        "conductorPhone": "+91 98112 06002",
        "routeId": "rt-06",
        "routeName": "Route 6 – Vasundhara & Sahibabad",
        "startPoint": "Vasundhara Sector 4",
        "endPoint": "ABES Business School (Lal Kuan)",
        "startDestination": "Vasundhara ➔ ABES Campus (Lal Kuan)",
        "totalDistance": "14.0 km",
        "estimatedTime": "34 mins",
        "currentLocation": "Arthala Metro Station",
        "gpsStatus": "ONLINE",
        "cameraStatus": "ONLINE",
        "status": "ON_ROUTE",
        "currentSpeed": 36,
        "batteryFuel": 85,
        "nextStop": "Sahibabad Industrial Gate",
        "eta": "4 mins",
        "latitude": 28.6650,
        "longitude": 77.3820,
        "stops": [
            {"id": "st-06-1", "name": "Vasundhara Sector 4 Plaza", "morningTime": "07:05 AM", "eveningTime": "02:30 PM", "studentCount": 4},
            {"id": "st-06-2", "name": "Sahibabad Industrial Area Gate", "morningTime": "07:20 AM", "eveningTime": "02:45 PM", "studentCount": 3},
            {"id": "st-06-3", "name": "Arthala Metro Red Line", "morningTime": "07:35 AM", "eveningTime": "03:00 PM", "studentCount": 4},
            {"id": "st-06-4", "name": "ABES Business School Main Gate", "morningTime": "07:55 AM", "eveningTime": "03:20 PM", "studentCount": 3},
        ]
    },
    {
        "id": "bus-07",
        "busNumber": "Bus #07",
        "licensePlate": "UP 14 BT 1007",
        "capacity": 40,
        "totalAssignedStudents": 14,
        "insideBusCount": 11,
        "offboardedCount": 3,
        "waitingCount": 0,
        "driverId": "drv-07",
        "driverName": "Virender Tyagi",
        "driverPhone": "+91 98112 07001",
        "conductorName": "Deepak Nagar",
        "conductorPhone": "+91 98112 07002",
        "routeId": "rt-07",
        "routeName": "Route 7 – Shastri Nagar & Kavi Nagar",
        "startPoint": "Kavi Nagar C-Block",
        "endPoint": "ABES Business School (Lal Kuan)",
        "startDestination": "Kavi Nagar ➔ ABES Campus (Lal Kuan)",
        "totalDistance": "10.5 km",
        "estimatedTime": "26 mins",
        "currentLocation": "Hapur Chungi Flyover",
        "gpsStatus": "ONLINE",
        "cameraStatus": "ONLINE",
        "status": "ON_ROUTE",
        "currentSpeed": 34,
        "batteryFuel": 92,
        "nextStop": "Shastri Nagar Market",
        "eta": "5 mins",
        "latitude": 28.6680,
        "longitude": 77.4420,
        "stops": [
            {"id": "st-07-1", "name": "Kavi Nagar C-Block Community Centre", "morningTime": "07:15 AM", "eveningTime": "02:40 PM", "studentCount": 4},
            {"id": "st-07-2", "name": "Shastri Nagar Central Market", "morningTime": "07:28 AM", "eveningTime": "02:52 PM", "studentCount": 4},
            {"id": "st-07-3", "name": "Hapur Chungi Crossing", "morningTime": "07:40 AM", "eveningTime": "03:05 PM", "studentCount": 3},
            {"id": "st-07-4", "name": "ABES Business School Main Gate", "morningTime": "07:55 AM", "eveningTime": "03:20 PM", "studentCount": 3},
        ]
    },
    {
        "id": "bus-08",
        "busNumber": "Bus #08",
        "licensePlate": "UP 14 BT 1008",
        "capacity": 40,
        "totalAssignedStudents": 14,
        "insideBusCount": 12,
        "offboardedCount": 2,
        "waitingCount": 0,
        "driverId": "drv-08",
        "driverName": "Satish Chand",
        "driverPhone": "+91 98112 08001",
        "conductorName": "Gopal Rawat",
        "conductorPhone": "+91 98112 08002",
        "routeId": "rt-08",
        "routeName": "Route 8 – Anand Vihar & Kaushambi Express",
        "startPoint": "Anand Vihar ISBT",
        "endPoint": "ABES Business School (Lal Kuan)",
        "startDestination": "Anand Vihar ➔ ABES Campus (Lal Kuan)",
        "totalDistance": "17.0 km",
        "estimatedTime": "40 mins",
        "currentLocation": "Gazipur Border Flyover",
        "gpsStatus": "ONLINE",
        "cameraStatus": "ONLINE",
        "status": "ON_ROUTE",
        "currentSpeed": 45,
        "batteryFuel": 79,
        "nextStop": "Kaushambi Metro Hub",
        "eta": "6 mins",
        "latitude": 28.6470,
        "longitude": 77.3250,
        "stops": [
            {"id": "st-08-1", "name": "Anand Vihar ISBT Terminal", "morningTime": "07:00 AM", "eveningTime": "02:25 PM", "studentCount": 4},
            {"id": "st-08-2", "name": "Kaushambi Metro Station Hub", "morningTime": "07:15 AM", "eveningTime": "02:40 PM", "studentCount": 4},
            {"id": "st-08-3", "name": "Gazipur Border Toll Plaza", "morningTime": "07:30 AM", "eveningTime": "02:55 PM", "studentCount": 3},
            {"id": "st-08-4", "name": "ABES Business School Main Gate", "morningTime": "07:55 AM", "eveningTime": "03:20 PM", "studentCount": 3},
        ]
    }
]

# Generate 112 students (14 per bus)
FIRST_NAMES = [
    "Aarav", "Ananya", "Rohan", "Diya", "Kabir", "Sneha", "Aditya", "Isha", "Vihaan", "Tanvi",
    "Arjun", "Pooja", "Aryan", "Meera", "Yash", "Riya", "Kunal", "Anushka", "Nikhil", "Shreya",
    "Manish", "Divya", "Dhruv", "Kavya", "Rahul", "Neha", "Shivam", "Simran", "Varun", "Kritika",
    "Harsh", "Shruti", "Gaurav", "Nandini", "Ayush", "Bhavya", "Siddharth", "Prachi", "Rishabh", "Sakshi",
    "Mayank", "Mansi", "Pranav", "Palak", "Karthik", "Rupal", "Chirag", "Janhvi", "Tarun", "Payal",
    "Aakash", "Tanya", "Deepak", "Mahima", "Ashish", "Sonakshi", "Abhinav", "Aditi", "Sahil", "Garima",
    "Vikas", "Rashmi", "Mohit", "Swati", "Aman", "Nikita", "Gaurika", "Alok", "Chhaya", "Pankaj",
    "Jyoti", "Sanjay", "Kiran", "Naveen", "Barkha", "Saurabh", "Preeti", "Umesh", "Kajal", "Rajeev",
    "Monika", "Gautam", "Sheetal", "Ankit", "Deepika", "Sumit", "Richa", "Hemant", "Meenakshi", "Girish",
    "Vandana", "Sunil", "Renu", "Dinesh", "Suman", "Mukesh", "Anita", "Ramesh", "Sunita", "Harish",
    "Sarita", "Naresh", "Babita", "Santosh", "Laxmi", "Vinod", "Geeta", "Kamal", "Sharda", "Mahesh",
    "Pushpa", "Satish"
]

LAST_NAMES = [
    "Sharma", "Verma", "Gupta", "Singh", "Aggarwal", "Mishra", "Chauhan", "Tiwari", "Yadav", "Pandey",
    "Saxena", "Bhatnagar", "Chopra", "Malhotra", "Kapoor", "Jain", "Bansal", "Goel", "Tyagi", "Tomar",
    "Bhardwaj", "Tripathi", "Shukla", "Dubey", "Rawat", "Bisht", "Negi", "Chander", "Ranjan", "Deshmukh"
]

PARENT_FIRST_NAMES_MALE = ["Rajesh", "Suresh", "Manoj", "Vikram", "Ajay", "Sanjay", "Rakesh", "Anil", "Sunil", "Dharmendra", "Mukesh", "Pramod", "Alok", "Devendra", "Ashok", "Satish"]
PARENT_FIRST_NAMES_FEMALE = ["Sunita", "Pooja", "Rekha", "Anita", "Kavita", "Geeta", "Seema", "Sangeeta", "Meena", "Ritu", "Saroj", "Mamta", "Sudha", "Vandana"]

AVATARS = [
    "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
]

COURSE_GRADES = ["MBA Sem 1", "MBA Sem 3", "MCA Year 1", "MCA Year 2", "BBA Sem 2", "BBA Sem 4", "BBA Sem 6", "PGDM Sec A", "PGDM Sec B"]

ADDRESSES_POOL = {
    "bus-01": [
        "Flat 502, Shipra Sun City, Indirapuram, Ghaziabad",
        "Tower 2, Express Garden, Vaishali Sector 4, Ghaziabad",
        "B-14, Ahinsa Khand 2, Indirapuram, Ghaziabad",
        "Plot 88, Nyay Khand 1, Indirapuram, Ghaziabad",
        "G-12, Judges Enclave, Ahinsa Khand 1, Indirapuram",
        "C-304, Gaur Green City, Indirapuram",
        "Tower B, ATS Advantage, Ahinsa Khand 1, Indirapuram",
    ],
    "bus-02": [
        "B-44, Sector 62, Noida, Gautam Buddha Nagar",
        "Tower 1, Stellar Park, Sector 62, Noida",
        "Flat 102, Purvanchal Silver City, Sector 62, Noida",
        "House 120, Mamura Village, Sector 66, Noida",
        "C-15, Shatabdi Rail Vihar, Sector 62, Noida",
        "D-88, T-Series Enclave, Sector 62, Noida",
        "A-201, Designarch e-Homes, Sector 62, Noida",
    ],
    "bus-03": [
        "Tower 6, River Heights, Raj Nagar Extension, Ghaziabad",
        "Flat 304, KW Srishti, Raj Nagar Extension, Ghaziabad",
        "B-12, Mohan Nagar Awas Vikas, Ghaziabad",
        "House 45, Chander Nagar, Near Old Bus Stand, Ghaziabad",
        "Tower 3, VVIP Addresses, Raj Nagar Extn, Ghaziabad",
        "Flat 801, Officer City, Raj Nagar Extension, Ghaziabad",
        "C-22, Patel Nagar, Near Old Bus Stand, Ghaziabad",
    ],
    "bus-04": [
        "Tower 8, Mahagun Mascot, Crossings Republik, Ghaziabad",
        "Flat 402, Gaur Global Village, Crossings Republik, Ghaziabad",
        "B-1102, Ajnara Gen X, Crossings Republik, Ghaziabad",
        "House 78, Chipiyana Buzurg Main Road, Ghaziabad",
        "Tower 4, Panchsheel Wellington, Crossings Republik",
        "Flat 205, Paramount Symphony, Crossings Republik",
        "Tower 12, Supertech Livingston, Crossings Republik",
    ],
    "bus-05": [
        "Tower 14, 14th Avenue, Gaur City 2, Greater Noida West",
        "Flat 602, 11th Avenue, Gaur City 2, Greater Noida West",
        "Tower D, Supertech Eco Village 1, Greater Noida West",
        "Flat 301, Panchsheel Greens 1, Greater Noida West",
        "Tower C, Cherry County, Ek Murti, Greater Noida West",
        "Flat 904, Ace City, Sector 1, Greater Noida West",
        "Tower 2, Arihant Arden, Greater Noida West",
    ],
    "bus-06": [
        "House 112, Sector 4, Vasundhara, Ghaziabad",
        "Flat 204, Sector 11, Vasundhara, Ghaziabad",
        "B-35, Sahibabad Industrial Area Site 4, Ghaziabad",
        "Plot 90, Brij Vihar, Surya Nagar, Ghaziabad",
        "Flat 502, Olive County, Sector 5, Vasundhara, Ghaziabad",
        "House 44, Sector 2B, Vasundhara, Ghaziabad",
        "C-18, Arthala Village Road, Mohan Nagar, Ghaziabad",
    ],
    "bus-07": [
        "C-45, Kavi Nagar, Ghaziabad, Uttar Pradesh",
        "E-12, Shastri Nagar, Ghaziabad, Uttar Pradesh",
        "House 89, Sector 23, Sanjay Nagar, Ghaziabad",
        "Plot 140, Govindpuram, Hapur Road, Ghaziabad",
        "B-201, Rajendra Nagar Sector 3, Ghaziabad",
        "C-15, Chiranjiv Vihar, Ghaziabad",
        "House 77, Hapur Chungi Main Chowk, Ghaziabad",
    ],
    "bus-08": [
        "Flat 301, Pocket A, Kaushambi, Ghaziabad",
        "House 55, DDA Flats, Gazipur, East Delhi",
        "Plot 112, Anand Vihar Colony, Delhi",
        "B-42, Shrestha Vihar, Vikas Marg Extension, Delhi",
        "Flat 204, Cloud 9 Towers, Sector 1, Vaishali, Ghaziabad",
        "House 88, Kaushambi DDA SFS Flats, Ghaziabad",
        "Plot 19, Yojna Vihar, Near Anand Vihar, Delhi",
    ],
}

students_list = []
parents_list = []
attendance_list = []

student_idx = 101

for bus in BUS_ROUTES:
    bus_id = bus["id"]
    bus_number = bus["busNumber"]
    route_name = bus["routeName"]
    addresses = ADDRESSES_POOL[bus_id]

    for i in range(14): # 14 students per bus
        s_id = f"stu-{student_idx}"
        roll_no = f"ABES-{student_idx}"
        first_name = FIRST_NAMES[(student_idx - 101) % len(FIRST_NAMES)]
        last_name = LAST_NAMES[(student_idx - 101) % len(LAST_NAMES)]
        full_name = f"{first_name} {last_name}"
        
        is_father = (i % 2 == 0)
        p_first = PARENT_FIRST_NAMES_MALE[student_idx % len(PARENT_FIRST_NAMES_MALE)] if is_father else PARENT_FIRST_NAMES_FEMALE[student_idx % len(PARENT_FIRST_NAMES_FEMALE)]
        p_relation = "Father" if is_father else "Mother"
        parent_name = f"{p_first} {last_name}"
        parent_id = f"par-{student_idx}"
        parent_phone = f"+91 98112 {student_idx:05d}"
        
        address = addresses[i % len(addresses)]
        grade = COURSE_GRADES[i % len(COURSE_GRADES)]
        section = chr(65 + (i % 3)) # A, B, C
        avatar = AVATARS[(student_idx - 101) % len(AVATARS)]
        
        # 10 Boarded, 4 Dropped/Waiting
        if i < 10:
            status_val = "BOARDED"
            checkin_time = f"07:{15 + (i * 3):02d} AM"
        elif i < 13:
            status_val = "OFFBOARDED"
            checkin_time = f"08:{i:02d} AM (Dropped)"
        else:
            status_val = "WAITING"
            checkin_time = "Not Checked In"

        students_list.append({
            "id": s_id,
            "name": full_name,
            "rollNo": roll_no,
            "grade": grade,
            "section": section,
            "address": address,
            "busId": bus_id,
            "busNumber": bus_number,
            "routeName": route_name,
            "parentId": parent_id,
            "parentName": parent_name,
            "parentPhone": parent_phone,
            "status": status_val,
            "lastCheckin": checkin_time,
            "avatarUrl": avatar,
            "faceRegistered": True,
        })

        parents_list.append({
            "id": parent_id,
            "name": parent_name,
            "relation": p_relation,
            "email": f"{p_first.lower()}.{last_name.lower()}@example.com",
            "phone": parent_phone,
            "address": address,
            "emergencyContact": f"+91 98112 {(student_idx + 500):05d}",
            "occupation": "Corporate Professional" if is_father else "Associate Director",
            "linkedStudentIds": [s_id],
            "linkedStudentNames": [full_name],
        })

        if status_val == "BOARDED":
            attendance_list.append({
                "id": f"att-{student_idx}",
                "studentId": s_id,
                "studentName": full_name,
                "rollNo": roll_no,
                "grade": grade,
                "busNumber": bus_number,
                "eventType": "BOARD",
                "timestamp": checkin_time,
                "confidence": round(99.1 + (random.randint(1, 8) / 10.0), 2),
                "verificationMethod": "AI Face Biometrics",
                "status": "VERIFIED",
                "photoUrl": avatar,
                "shift": "Morning Pickup",
                "stopLocation": bus["stops"][min(i // 4, len(bus["stops"]) - 1)]["name"],
            })

        student_idx += 1

buses_json = json.dumps(BUS_ROUTES)
parents_json = json.dumps(parents_list)
students_json = json.dumps(students_list)
attendance_json = json.dumps(attendance_list)

# Write to backend/models/seed_data.py
seed_py_content = f'''import json
from sqlalchemy.orm import Session
from .database import Base, engine, SessionLocal, StudentModel, ParentModel, BusModel, RouteModel, AttendanceModel, AlertModel

BUSES_DATA = json.loads({json.dumps(buses_json)})
PARENTS_DATA = json.loads({json.dumps(parents_json)})
STUDENTS_DATA = json.loads({json.dumps(students_json)})
ATTENDANCE_DATA = json.loads({json.dumps(attendance_json)})

def seed_database(db: Session = None):
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    try:
        # Cleanly delete old records to reseed
        db.query(AttendanceModel).delete()
        db.query(AlertModel).delete()
        db.query(StudentModel).delete()
        db.query(ParentModel).delete()
        db.query(RouteModel).delete()
        db.query(BusModel).delete()
        db.commit()

        # 1. Seed 8 Buses for ABES Business School, Near Lal Kuan, Ghaziabad
        for b in BUSES_DATA:
            db_bus = BusModel(
                id=b["id"],
                bus_number=b["busNumber"],
                license_plate=b["licensePlate"],
                capacity=b["capacity"],
                total_assigned_students=b["totalAssignedStudents"],
                inside_bus_count=b["insideBusCount"],
                offboarded_count=b["offboardedCount"],
                waiting_count=b["waitingCount"],
                driver_id=b["driverId"],
                driver_name=b["driverName"],
                driver_phone=b["driverPhone"],
                conductor_name=b["conductorName"],
                conductor_phone=b["conductorPhone"],
                route_id=b["routeId"],
                route_name=b["routeName"],
                current_location=b["currentLocation"],
                gps_status=b["gpsStatus"],
                camera_status=b["cameraStatus"],
                status=b["status"],
                current_speed=b["currentSpeed"],
                battery_fuel=b["batteryFuel"],
                next_stop=b["nextStop"],
                eta=b["eta"],
                latitude=b["latitude"],
                longitude=b["longitude"],
            )
            db.add(db_bus)

        # 2. Seed 8 Routes
        for b in BUSES_DATA:
            db_route = RouteModel(
                id=b["routeId"],
                name=b["routeName"],
                start_destination=b["startDestination"],
                assigned_bus_id=b["id"],
                assigned_bus_number=b["busNumber"],
                total_stops=len(b["stops"]),
                active_students_count=b["totalAssignedStudents"],
                stops=json.dumps(b["stops"]),
            )
            db.add(db_route)

        # 3. Seed 112 Parents
        for p in PARENTS_DATA:
            db_parent = ParentModel(
                id=p["id"],
                name=p["name"],
                relation=p["relation"],
                email=p["email"],
                phone=p["phone"],
                address=p["address"],
                emergency_contact=p["emergencyContact"],
                occupation=p["occupation"],
                linked_student_ids=json.dumps(p["linkedStudentIds"]),
            )
            db.add(db_parent)

        # 4. Seed 112 Students
        for s in STUDENTS_DATA:
            db_student = StudentModel(
                id=s["id"],
                name=s["name"],
                roll_no=s["rollNo"],
                grade=s["grade"],
                section=s["section"],
                address=s["address"],
                bus_id=s["busId"],
                bus_number=s["busNumber"],
                route_name=s["routeName"],
                parent_id=s["parentId"],
                parent_name=s["parentName"],
                parent_phone=s["parentPhone"],
                status=s["status"],
                last_checkin=s["lastCheckin"],
                avatar_url=s["avatarUrl"],
                face_registered=True,
            )
            db.add(db_student)

        # 5. Seed Attendance Logs
        for a in ATTENDANCE_DATA:
            db_att = AttendanceModel(
                id=a["id"],
                student_id=a["studentId"],
                student_name=a["studentName"],
                roll_no=a["rollNo"],
                grade=a["grade"],
                bus_number=a["busNumber"],
                event_type=a["eventType"],
                timestamp=a["timestamp"],
                confidence=a["confidence"],
                verification_method=a["verificationMethod"],
                status=a["status"],
                photo_url=a["photoUrl"],
                shift=a["shift"],
                stop_location=a["stopLocation"],
            )
            db.add(db_att)

        # 6. Seed Safety SOS Alert
        sample_alert = AlertModel(
            id="alt-01",
            title="Excess Velocity Warning (NH-09 Highway)",
            description="Bus #08 exceeded designated safety limit (55 km/h on NH-09 Expressway near Gazipur border). Conductor notified.",
            severity="MEDIUM",
            bus_number="Bus #08",
            timestamp="07:42 AM",
            type="OVERSPEEDING",
            resolved=False,
        )
        db.add(sample_alert)

        db.commit()
        print("ABES Business School Database Seeded Successfully with 112 Students and 8 Buses!")
    except Exception as e:
        db.rollback()
        print("Error seeding database:", e)
    finally:
        if should_close:
            db.close()

def seed_database_if_empty(db: Session):
    existing_count = db.query(StudentModel).count()
    if existing_count == 0 or existing_count < 100:
        seed_database(db)

if __name__ == "__main__":
    seed_database()
'''

with open("/Users/apple/Desktop/untitled folder/backend/models/seed_data.py", "w") as f:
    f.write(seed_py_content)

print("Wrote seed_data.py successfully!")
