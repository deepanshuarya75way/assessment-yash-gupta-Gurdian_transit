"use client";

import React, { useState } from "react";
import { SmoothScrollProvider } from "@/components/transitions/SmoothScrollProvider";
import { WebGlParticleCanvas } from "@/components/3d/WebGlParticleCanvas";
import { FloatingIslandNav, NavTabType } from "@/components/layout/FloatingIslandNav";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { ClipPathTransition } from "@/components/transitions/ClipPathTransition";

// Module Views
import { ExecutiveMetricsGrid } from "@/components/home/ExecutiveMetricsGrid";
import { MultiFilterBar } from "@/components/home/MultiFilterBar";
import { GoogleMapRadarWidget } from "@/components/home/GoogleMapRadarWidget";
import { FilteredManifestView } from "@/components/home/FilteredManifestView";
import { StudentManagement } from "@/components/students/StudentManagement";
import { ParentManagement } from "@/components/parents/ParentManagement";
import { BusManagement } from "@/components/fleet/BusManagement";
import { DriverManagement } from "@/components/drivers/DriverManagement";
import { RouteManagement } from "@/components/routes/RouteManagement";
import { SpeedAndAiSafetyHub } from "@/components/safety-ai/SpeedAndAiSafetyHub";
import { AttendanceLedger } from "@/components/attendance/AttendanceLedger";
import { LiveFleetRadar } from "@/components/tracking/LiveFleetRadar";
import { AlertManagement } from "@/components/alerts/AlertManagement";
import { SystemSettings } from "@/components/settings/SystemSettings";
import { ApiClient } from "@/services/apiClient";

// Mock Database
import {
  SEED_STUDENTS,
  SEED_PARENTS,
  SEED_BUSES,
  SEED_DRIVERS,
  SEED_ROUTES,
  SEED_ATTENDANCE,
  SEED_ALERTS,
  Student,
  Parent,
  Bus,
  Driver,
  Route,
  AttendanceRecord,
  SafetyAlert,
} from "@/data/enterpriseMockData";

// Icons & Modals
import { Scan, ShieldAlert, Users, Bus as BusIcon, Sparkles, Smartphone, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StudentModal } from "@/components/students/StudentModal";
import { MobileDemoModal } from "@/components/mobile/MobileDemoModal";
import Link from "next/link";

export default function EnterpriseAdminConsole() {
  const [activeTab, setActiveTab] = useState<NavTabType>("home");

  // Selected Focus Bus
  const [selectedBusId, setSelectedBusId] = useState<string>(SEED_BUSES[0].id);

  // Multi-Filter States for Executive Home
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("ALL");
  const [selectedBus, setSelectedBus] = useState("ALL");
  const [selectedRoute, setSelectedRoute] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Relational Database State
  const [students, setStudents] = useState<Student[]>(SEED_STUDENTS);
  const [parents, setParents] = useState<Parent[]>(SEED_PARENTS);
  const [buses, setBuses] = useState<Bus[]>(SEED_BUSES);
  const [drivers, setDrivers] = useState<Driver[]>(SEED_DRIVERS);
  const [routes, setRoutes] = useState<Route[]>(SEED_ROUTES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(SEED_ATTENDANCE);
  const [alerts, setAlerts] = useState<SafetyAlert[]>(SEED_ALERTS);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [isMobileDemoModalOpen, setIsMobileDemoModalOpen] = useState(false);

  // Dual-Layer Persistence: Hydrate from localStorage / ABES dataset, then sync with live FastAPI backend
  React.useEffect(() => {
    try {
      const dbVersion = localStorage.getItem("guardian_db_v");
      if (dbVersion !== "abes_v2") {
        // Upgrade to fresh ABES dataset with Yash Gupta at index 0
        localStorage.clear();
        localStorage.setItem("guardian_db_v", "abes_v2");
        localStorage.setItem("guardian_students", JSON.stringify(SEED_STUDENTS));
        localStorage.setItem("guardian_parents", JSON.stringify(SEED_PARENTS));
        localStorage.setItem("guardian_buses", JSON.stringify(SEED_BUSES));
        localStorage.setItem("guardian_routes", JSON.stringify(SEED_ROUTES));
        localStorage.setItem("guardian_attendance", JSON.stringify(SEED_ATTENDANCE));
        localStorage.setItem("guardian_alerts", JSON.stringify(SEED_ALERTS));
        setStudents(SEED_STUDENTS);
        setParents(SEED_PARENTS);
        setBuses(SEED_BUSES);
        setRoutes(SEED_ROUTES);
        setAttendance(SEED_ATTENDANCE);
        setAlerts(SEED_ALERTS);

        // Also push Yash Gupta to backend database
        ApiClient.createStudent(SEED_STUDENTS[0]);
        ApiClient.createParent(SEED_PARENTS[0]);
      } else {
        const cachedStudents = localStorage.getItem("guardian_students");
        const cachedParents = localStorage.getItem("guardian_parents");
        const cachedBuses = localStorage.getItem("guardian_buses");
        const cachedRoutes = localStorage.getItem("guardian_routes");
        const cachedAttendance = localStorage.getItem("guardian_attendance");
        const cachedAlerts = localStorage.getItem("guardian_alerts");

        if (cachedStudents) setStudents(JSON.parse(cachedStudents));
        if (cachedParents) setParents(JSON.parse(cachedParents));
        if (cachedBuses) setBuses(JSON.parse(cachedBuses));
        if (cachedRoutes) setRoutes(JSON.parse(cachedRoutes));
        if (cachedAttendance) setAttendance(JSON.parse(cachedAttendance));
        if (cachedAlerts) setAlerts(JSON.parse(cachedAlerts));
      }
    } catch (e) {
      console.error("Local storage hydration error", e);
    }

    const syncBackend = async () => {
      const isOnline = await ApiClient.checkHealth();
      setIsBackendOnline(isOnline);

      if (isOnline) {
        const [apiStudents, apiParents, apiBuses, apiRoutes, apiAttendance, apiAlerts] = await Promise.all([
          ApiClient.getStudents(),
          ApiClient.getParents(),
          ApiClient.getBuses(),
          ApiClient.getRoutes(),
          ApiClient.getAttendance(),
          ApiClient.getAlerts(),
        ]);

        if (apiStudents && apiStudents.length > 0) {
          setStudents((prevLocal) => {
            const combined = [...prevLocal];
            apiStudents.forEach((apiStu) => {
              const existingIdx = combined.findIndex((s) => s.id === apiStu.id || s.rollNo === apiStu.rollNo);
              if (existingIdx !== -1) {
                combined[existingIdx] = { ...combined[existingIdx], ...apiStu };
              } else {
                combined.push(apiStu);
              }
            });
            try { localStorage.setItem("guardian_students", JSON.stringify(combined)); } catch {}
            return combined;
          });
        }
        if (apiParents && apiParents.length > 0) {
          setParents((prevLocal) => {
            const combined = [...prevLocal];
            apiParents.forEach((apiPar) => {
              const existingIdx = combined.findIndex((p) => p.id === apiPar.id || p.name === apiPar.name);
              if (existingIdx !== -1) {
                combined[existingIdx] = { ...combined[existingIdx], ...apiPar };
              } else {
                combined.push(apiPar);
              }
            });
            try { localStorage.setItem("guardian_parents", JSON.stringify(combined)); } catch {}
            return combined;
          });
        }
        if (apiBuses && apiBuses.length > 0) {
          setBuses(apiBuses);
          try { localStorage.setItem("guardian_buses", JSON.stringify(apiBuses)); } catch {}
        }
        if (apiRoutes && apiRoutes.length > 0) {
          setRoutes(apiRoutes);
          try { localStorage.setItem("guardian_routes", JSON.stringify(apiRoutes)); } catch {}
        }
        if (apiAttendance && apiAttendance.length > 0) {
          setAttendance(apiAttendance);
          try { localStorage.setItem("guardian_attendance", JSON.stringify(apiAttendance)); } catch {}
        }
        if (apiAlerts && apiAlerts.length > 0) {
          setAlerts(apiAlerts);
          try { localStorage.setItem("guardian_alerts", JSON.stringify(apiAlerts)); } catch {}
        }
      }
    };

    syncBackend();
  }, []);

  // Multi-Tab & Cross-Component Synchronization Listener
  React.useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const cachedStudents = localStorage.getItem("guardian_students");
        const cachedParents = localStorage.getItem("guardian_parents");
        const cachedBuses = localStorage.getItem("guardian_buses");
        const cachedRoutes = localStorage.getItem("guardian_routes");
        const cachedAttendance = localStorage.getItem("guardian_attendance");
        const cachedAlerts = localStorage.getItem("guardian_alerts");
        if (cachedStudents) setStudents(JSON.parse(cachedStudents));
        if (cachedParents) setParents(JSON.parse(cachedParents));
        if (cachedBuses) setBuses(JSON.parse(cachedBuses));
        if (cachedRoutes) setRoutes(JSON.parse(cachedRoutes));
        if (cachedAttendance) setAttendance(JSON.parse(cachedAttendance));
        if (cachedAlerts) setAlerts(JSON.parse(cachedAlerts));
      } catch {}
    };

    window.addEventListener("guardian_data_updated", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("guardian_data_updated", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  // Real-Time Live WebSocket Listener (Boarding Events, Unauthorized Persons, Route Deviations)
  React.useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWs = () => {
      try {
        const host =
          typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
            ? window.location.hostname
            : "localhost";
        ws = new WebSocket(`ws://${host}:8000/api/v1/ws/live`);

        ws.onopen = () => {
          console.log("[Admin Console WebSocket] Connected to Real-Time Transit Mesh");
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "ATTENDANCE_EVENT" && data.data) {
              const att = data.data;
              setAttendance((prev) => [att, ...prev.filter((a) => a.id !== att.id)]);
              setStudents((prev) =>
                prev.map((s) => {
                  if (s.id === att.studentId || s.rollNo === att.rollNo) {
                    return {
                      ...s,
                      status: att.eventType === "BOARD" ? "BOARDED" : "OFFBOARDED",
                      lastCheckin: `${att.timestamp} (${att.verificationMethod})`,
                    };
                  }
                  return s;
                })
              );
              setBuses((prev) =>
                prev.map((b) => {
                  if (b.busNumber === att.busNumber) {
                    if (att.eventType === "BOARD") {
                      return {
                        ...b,
                        insideBusCount: (b.insideBusCount || 0) + 1,
                        waitingCount: Math.max(0, (b.waitingCount || 0) - 1),
                      };
                    } else {
                      return {
                        ...b,
                        insideBusCount: Math.max(0, (b.insideBusCount || 0) - 1),
                        offboardedCount: (b.offboardedCount || 0) + 1,
                      };
                    }
                  }
                  return b;
                })
              );
              setActiveToast({
                id: `toast-${Date.now()}`,
                type: att.eventType === "BOARD" ? "BOARD" : "OFFBOARD",
                title: att.eventType === "BOARD" ? `🟢 ${att.studentName} Boarded ${att.busNumber}` : `🔵 ${att.studentName} Deboarded ${att.busNumber}`,
                description: `Verified at ${att.stopLocation || "Bus Terminal"} via ${att.verificationMethod} (${att.confidence}% Match)`,
                timestamp: att.timestamp || new Date().toLocaleTimeString(),
              });
            } else if (data.type === "SAFETY_ALERT" && data.data) {
              const alt = data.data;
              setAlerts((prev) => [alt, ...prev.filter((a) => a.id !== alt.id)]);
              setActiveToast({
                id: `toast-${Date.now()}`,
                type: alt.type === "UNAUTHORIZED_PERSON" ? "SECURITY" : "ALERT",
                title: alt.title || "🚨 Fleet Safety Alert",
                description: `${alt.description || "Alert logged for " + alt.busNumber}`,
                timestamp: alt.timestamp || new Date().toLocaleTimeString(),
              });
            }
          } catch (err) {
            console.error("WS Parse error", err);
          }
        };

        ws.onclose = () => {
          reconnectTimeout = setTimeout(connectWs, 3000);
        };
      } catch (err) {
        reconnectTimeout = setTimeout(connectWs, 3000);
      }
    };

    connectWs();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  // Real-time persistence to local storage on any state update
  React.useEffect(() => {
    try { localStorage.setItem("guardian_students", JSON.stringify(students)); } catch {}
  }, [students]);

  React.useEffect(() => {
    try { localStorage.setItem("guardian_parents", JSON.stringify(parents)); } catch {}
  }, [parents]);

  React.useEffect(() => {
    try { localStorage.setItem("guardian_buses", JSON.stringify(buses)); } catch {}
  }, [buses]);

  React.useEffect(() => {
    try { localStorage.setItem("guardian_routes", JSON.stringify(routes)); } catch {}
  }, [routes]);

  React.useEffect(() => {
    try { localStorage.setItem("guardian_attendance", JSON.stringify(attendance)); } catch {}
  }, [attendance]);

  React.useEffect(() => {
    try { localStorage.setItem("guardian_alerts", JSON.stringify(alerts)); } catch {}
  }, [alerts]);

  const [activeToast, setActiveToast] = useState<{
    id: string;
    type: "BOARD" | "OFFBOARD" | "ALERT" | "SECURITY";
    title: string;
    description: string;
    timestamp: string;
  } | null>(null);

  // Auto-dismiss toast after 6 seconds
  React.useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => setActiveToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  // Quick Modal
  const [isQuickAddStudentOpen, setIsQuickAddStudentOpen] = useState(false);

  const criticalAlertCount = alerts.filter((a) => !a.resolved && a.severity === "CRITICAL").length;

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGrade("ALL");
    setSelectedBus("ALL");
    setSelectedRoute("ALL");
    setSelectedStatus("ALL");
  };

  // Dynamic Multi-Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = selectedGrade === "ALL" ? true : s.grade === selectedGrade;
    const matchesBus = selectedBus === "ALL" ? true : s.busNumber === selectedBus;
    const matchesRoute = selectedRoute === "ALL" ? true : s.routeName === selectedRoute;
    const matchesStatus = selectedStatus === "ALL" ? true : s.status === selectedStatus;

    return matchesSearch && matchesGrade && matchesBus && matchesRoute && matchesStatus;
  });

  // Selected Focus Bus Object
  const currentFocusedBus = buses.find((b) => b.id === selectedBusId) || buses[0];

  // Student CRUD
  const handleAddStudent = (student: Student) => {
    // 1. Check if matching parent exists by ID or name
    const existingParent = parents.find(
      (p) =>
        (student.parentId && p.id === student.parentId) ||
        (student.parentName && p.name.trim().toLowerCase() === student.parentName.trim().toLowerCase())
    );

    const finalParentId = existingParent ? existingParent.id : (student.parentId || `par-${Date.now()}`);
    const finalStudent: Student = {
      ...student,
      parentId: finalParentId,
      parentName: existingParent ? existingParent.name : student.parentName,
      parentPhone: existingParent ? existingParent.phone : (student.parentPhone || "+91 98765 43210"),
    };

    setStudents((prev) => [finalStudent, ...prev]);
    ApiClient.createStudent(finalStudent);

    if (finalStudent.parentName && finalStudent.parentName !== "No Parent Assigned" && finalStudent.parentName.trim() !== "") {
      setParents((prevParents) => {
        const existingParentIndex = prevParents.findIndex(
          (p) => p.id === finalParentId || p.name.trim().toLowerCase() === finalStudent.parentName.trim().toLowerCase()
        );

        if (existingParentIndex !== -1) {
          const updatedParents = prevParents.map((p, idx) => {
            if (idx === existingParentIndex) {
              const linkedIds = p.linkedStudentIds || [];
              const linkedNames = p.linkedStudentNames || [];
              const updatedP: Parent = {
                ...p,
                linkedStudentIds: linkedIds.includes(finalStudent.id) ? linkedIds : [...linkedIds, finalStudent.id],
                linkedStudentNames: linkedNames.includes(finalStudent.name) ? linkedNames : [...linkedNames, finalStudent.name],
              };
              ApiClient.createParent(updatedP);
              return updatedP;
            }
            return p;
          });
          return updatedParents;
        } else {
          const newParent: Parent = {
            id: finalParentId,
            name: finalStudent.parentName,
            relation: "Father",
            phone: finalStudent.parentPhone || "+91 98765 43210",
            email: `${finalStudent.parentName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
            address: finalStudent.address || "Delhi NCR",
            emergencyContact: finalStudent.parentPhone || "+91 98765 43210",
            occupation: "Guardian",
            linkedStudentIds: [finalStudent.id],
            linkedStudentNames: [finalStudent.name],
            password: "parent123",
          };
          ApiClient.createParent(newParent);
          return [newParent, ...prevParents];
        }
      });
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guardian_data_updated"));
    }
  };

 
 
 
 
 
 
 
  const handleUpdateStudent = (updated: Student) => {
    const oldStudent = students.find((s) => s.id === updated.id);

    if(oldStudent && oldStudent.busId !== updated.busId){
      updated.transferHistory = [
        ...(oldStudent.transferHistory || []),
        {
          formBus: oldStudent.busNumber,
          toBus: updated.busNumber,
          date: new Date().toLocaleDateString(),
        },
      ];
    }
 
    setBuses((prevBuses) => {
        const oldStudent = students.find((s) => s.id === handleUpdateDriver.id);

        if(!oldStudent || oldStudent.busId === updated.busId){
          return prevBuses;
        }

        return prevBuses.map((bus) => {
          if(bus.id === oldStudent.busId){
            return {
              ...bus,
              totalAssignedStudents: Math.max(0,bus.totalAssignedStudents-1),

            };
          }

          if(bus.id === updated.busId){
            return{
              ...bus,
              totalAssignedStudents: bus.totalAssignedStudents+1,
            };
          }
          return bus;
        });

    });
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    ApiClient.updateStudent(updated);

    if (updated.parentName && updated.parentName !== "No Parent Assigned" && updated.parentName.trim() !== "") {
      setParents((prevParents) => {
        const existingParent = prevParents.find(
          (p) => p.id === updated.parentId || p.name.trim().toLowerCase() === updated.parentName.trim().toLowerCase()
        );

        if (existingParent) {
          return prevParents.map((p) => {
            const isThisParent = p.id === existingParent.id;
            const hasStudent = (p.linkedStudentIds || []).includes(updated.id);

            if (isThisParent) {
              const linkedIds = p.linkedStudentIds || [];
              const linkedNames = p.linkedStudentNames || [];
              const updatedP: Parent = {
                ...p,
                name: updated.parentName || p.name,
                phone: updated.parentPhone || p.phone,
                linkedStudentIds: linkedIds.includes(updated.id) ? linkedIds : [...linkedIds, updated.id],
                linkedStudentNames: linkedNames.includes(updated.name) ? linkedNames : [...linkedNames, updated.name],
              };
              ApiClient.createParent(updatedP);
              return updatedP;
            } else if (hasStudent) {
              const updatedP: Parent = {
                ...p,
                linkedStudentIds: (p.linkedStudentIds || []).filter((id) => id !== updated.id),
                linkedStudentNames: (p.linkedStudentNames || []).filter((name) => name !== updated.name),
              };
              ApiClient.createParent(updatedP);
              return updatedP;
            }
            return p;
          });
        } else {
          const newParent: Parent = {
            id: updated.parentId || `par-${Date.now()}`,
            name: updated.parentName,
            relation: "Father",
            phone: updated.parentPhone || "+91 98765 43210",
            email: `${updated.parentName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
            address: updated.address || "Delhi NCR",
            emergencyContact: updated.parentPhone || "+91 98765 43210",
            occupation: "Guardian",
            linkedStudentIds: [updated.id],
            linkedStudentNames: [updated.name],
            password: "parent123",
          };
          ApiClient.createParent(newParent);
          return [newParent, ...prevParents];
        }
      });
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guardian_data_updated"));
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    ApiClient.deleteStudent(id);

    setParents((prev) =>
      prev.map((p) => {
        const updated = {
          ...p,
          linkedStudentIds: (p.linkedStudentIds || []).filter((sid) => sid !== id),
        };
        ApiClient.createParent(updated);
        return updated;
      })
    );

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guardian_data_updated"));
    }
  };

  const handleEnrollFaceSuccess = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, faceRegistered: true } : s))
    );
  };

  // Parent CRUD
  const handleAddParent = (parent: Parent) => {
    setParents((prev) => [parent, ...prev]);
    ApiClient.createParent(parent);

    if (parent.linkedStudentIds && parent.linkedStudentIds.length > 0) {
      setStudents((prevStudents) =>
        prevStudents.map((s) => {
          if (parent.linkedStudentIds.includes(s.id)) {
            const updatedStudent: Student = {
              ...s,
              parentId: parent.id,
              parentName: parent.name,
              parentPhone: parent.phone,
            };
            ApiClient.updateStudent(updatedStudent);
            return updatedStudent;
          }
          return s;
        })
      );
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guardian_data_updated"));
    }
  };

  const handleUpdateParent = (updated: Parent) => {
    setParents((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    ApiClient.createParent(updated);

    setStudents((prevStudents) =>
      prevStudents.map((s) => {
        if ((updated.linkedStudentIds || []).includes(s.id)) {
          const updatedStudent: Student = {
            ...s,
            parentId: updated.id,
            parentName: updated.name,
            parentPhone: updated.phone,
          };
          ApiClient.createStudent(updatedStudent);
          return updatedStudent;
        }
        return s;
      })
    );

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guardian_data_updated"));
    }
  };

  const handleDeleteParent = (id: string) => {
    setParents((prev) => prev.filter((p) => p.id !== id));
    ApiClient.deleteParent(id);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guardian_data_updated"));
    }
  };

  // Bus Fleet CRUD
  const handleAddBus = (bus: Bus) => setBuses((prev) => [bus, ...prev]);
  const handleUpdateBus = (updated: Bus) =>
    setBuses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  const handleDeleteBus = (id: string) =>
    setBuses((prev) => prev.filter((b) => b.id !== id));

  // Driver CRUD
  const handleAddDriver = (driver: Driver) => setDrivers((prev) => [driver, ...prev]);
  const handleUpdateDriver = (updated: Driver) =>
    setDrivers((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  const handleDeleteDriver = (id: string) =>
    setDrivers((prev) => prev.filter((d) => d.id !== id));

  // Route CRUD
  const handleAddRoute = (route: Route) => setRoutes((prev) => [route, ...prev]);
  const handleUpdateRoute = (updated: Route) =>
    setRoutes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  const handleDeleteRoute = (id: string) =>
    setRoutes((prev) => prev.filter((r) => r.id !== id));

  // Emergency Fleet Transfer Reassignment
  const handleEmergencyTransfer = (
    sourceBusId: string,
    targetBusId: string,
    reason: string,
    notifyParents: boolean
  ) => {
    const source = buses.find((b) => b.id === sourceBusId);
    const target = buses.find((b) => b.id === targetBusId);
    if (!source || !target) return;

    setStudents((prev) =>
      prev.map((s) => {
        if (s.busId === sourceBusId || s.busNumber === source.busNumber) {
          return {
            ...s,
            busId: target.id,
            busNumber: target.busNumber,
            routeName: target.routeName,
          };
        }
        return s;
      })
    );

    setBuses((prev) =>
      prev.map((b) => {
        if (b.id === sourceBusId) {
          return {
            ...b,
            status: "UNSERVICEABLE" as Bus["status"],
            currentSpeed: 0,
          };
        }
        if (b.id === targetBusId) {
          return {
            ...b,
            totalAssignedStudents: (b.totalAssignedStudents || 0) + (source.totalAssignedStudents || 0),
          };
        }
        return b;
      })
    );

    const newAlert: SafetyAlert = {
      id: `alt-tf-${Date.now()}`,
      title: "Emergency Fleet Transfer",
      description: `Bus ${source.busNumber} unserviceable (${reason}). Route & Students reassigned to ${target.busNumber} (${target.driverName}). ${
        notifyParents ? "SMS Notification broadcasted to all parents." : ""
      }`,
      severity: "MEDIUM",
      busNumber: target.busNumber,
      type: "FLEET_TRANSFER",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      resolved: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleAttendanceRecord = async (record: AttendanceRecord) => {
    setAttendance((prev) => [record, ...prev]);

    // Update student live status
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === record.studentId || s.rollNo === record.rollNo) {
          return {
            ...s,
            status: record.eventType === "BOARD" ? "BOARDED" : "OFFBOARDED",
            lastCheckin: `${record.timestamp} (${record.verificationMethod})`,
          };
        }
        return s;
      })
    );

    // Update bus live passenger occupancy count
    setBuses((prev) =>
      prev.map((b) => {
        if (b.busNumber === record.busNumber) {
          if (record.eventType === "BOARD") {
            return {
              ...b,
              insideBusCount: (b.insideBusCount || 0) + 1,
              waitingCount: Math.max(0, (b.waitingCount || 0) - 1),
            };
          } else {
            return {
              ...b,
              insideBusCount: Math.max(0, (b.insideBusCount || 0) - 1),
              offboardedCount: (b.offboardedCount || 0) + 1,
            };
          }
        }
        return b;
      })
    );

    // Call backend API
    try {
      await ApiClient.recordAttendance({
        studentId: record.studentId,
        studentName: record.studentName,
        rollNo: record.rollNo,
        grade: record.grade,
        busNumber: record.busNumber,
        eventType: record.eventType,
        timestamp: record.timestamp,
        confidence: record.confidence,
        verificationMethod: record.verificationMethod,
        status: record.status,
        photoUrl: record.photoUrl,
        shift: record.shift,
        stopLocation: record.stopLocation,
      });
    } catch (e) {
      console.warn("Backend record attendance sync skipped:", e);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guardian_data_updated"));
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a)));
    try {
      await ApiClient.resolveAlert(alertId);
    } catch {}
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guardian_data_updated"));
    }
  };

  const handleSendBroadcast = async (newAlert: SafetyAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    try {
      await ApiClient.broadcastSos(newAlert);
    } catch (e) {
      console.warn("Backend alert broadcast skipped:", e);
    }
    try {
      const cached = localStorage.getItem("guardian_alerts");
      const current = cached ? JSON.parse(cached) : [];
      localStorage.setItem("guardian_alerts", JSON.stringify([newAlert, ...current]));
    } catch {}
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guardian_data_updated"));
    }
  };

  const handleResetDatabase = () => {
    setStudents(SEED_STUDENTS);
    setParents(SEED_PARENTS);
    setBuses(SEED_BUSES);
    setRoutes(SEED_ROUTES);
    setAttendance(SEED_ATTENDANCE);
    setAlerts(SEED_ALERTS);
    try {
      localStorage.clear();
    } catch {}
  };

  return (
    <SmoothScrollProvider>
      <WebGlParticleCanvas />

      <div className="min-h-screen relative z-10 flex flex-col font-sans">
        <AppHeader
          activeTab={activeTab}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onTriggerSos={() => setActiveTab("alerts")}
          criticalAlertCount={criticalAlertCount}
          alerts={alerts}
        />

        {/* Live Real-Time Event Notification Toast (Boarding, Unknown Entity, Route Deviation) */}
        {activeToast && (
          <div className="fixed top-20 right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
            <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-xl ${
              activeToast.type === "SECURITY" || activeToast.type === "ALERT"
                ? "bg-rose-950/95 text-white border-rose-500/50 shadow-rose-950/50"
                : activeToast.type === "BOARD"
                ? "bg-emerald-950/95 text-white border-emerald-500/50 shadow-emerald-950/50"
                : "bg-slate-900/95 text-white border-slate-700/60 shadow-slate-950/50"
            }`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                activeToast.type === "SECURITY" || activeToast.type === "ALERT"
                  ? "bg-rose-500/30 text-rose-300 animate-pulse"
                  : "bg-emerald-500/30 text-emerald-300"
              }`}>
                {activeToast.type === "SECURITY" ? "🚨" : activeToast.type === "BOARD" ? "🟢" : "🔵"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black truncate">{activeToast.title}</h4>
                  <button
                    onClick={() => setActiveToast(null)}
                    className="text-white/60 hover:text-white text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] text-white/80 mt-0.5 leading-snug">{activeToast.description}</p>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/10 text-[10px] text-white/60 font-mono">
                  <span>{activeToast.timestamp}</span>
                  <button
                    onClick={() => {
                      if (activeToast.type === "SECURITY" || activeToast.type === "ALERT") {
                        setActiveTab("alerts");
                      } else {
                        setActiveTab("attendance");
                      }
                      setActiveToast(null);
                    }}
                    className="text-cyan-300 font-bold hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ClipPathTransition currentKey={activeTab}>
            {/* 1. EXECUTIVE HOME DASHBOARD */}
            {activeTab === "home" && (
              <div className="space-y-6">
                <ExecutiveMetricsGrid
                  buses={buses}
                  students={students}
                  alerts={alerts}
                  selectedBusId={selectedBusId}
                  onSelectBus={(id) => setSelectedBusId(id)}
                />

                <MultiFilterBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedGrade={selectedGrade}
                  setSelectedGrade={setSelectedGrade}
                  selectedBus={selectedBus}
                  setSelectedBus={setSelectedBus}
                  selectedRoute={selectedRoute}
                  setSelectedRoute={setSelectedRoute}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  buses={buses}
                  routes={routes}
                  onResetFilters={handleResetFilters}
                />

                <FilteredManifestView
                  filteredStudents={filteredStudents}
                  totalStudentsCount={students.length}
                  onNavigateToStudents={() => setActiveTab("students")}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <GoogleMapRadarWidget
                      buses={buses}
                      selectedBusId={selectedBusId}
                      onSelectBus={(id) => setSelectedBusId(id)}
                    />
                  </div>

                  <div className="clean-card rounded-2xl p-5 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          Live Bus Gate AI Biometric CCTV
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white font-mono">
                          {currentFocusedBus.busNumber} • CAM-01
                        </span>
                      </div>

                      <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 flex items-center justify-center border border-slate-200 shadow-inner group">
                        <div className="absolute inset-0 border-2 border-emerald-400/40 rounded-xl m-2 pointer-events-none" />
                        <div className="absolute top-3 left-3 text-[10px] font-mono text-emerald-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          FACE_ID: ACTIVE
                        </div>
                        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-emerald-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          FPS: 60.0
                        </div>

                        <div className="w-24 h-24 border-2 border-emerald-400 rounded-xl flex items-center justify-center relative shadow-lg shadow-emerald-500/20">
                          <div className="w-full h-0.5 bg-emerald-400 absolute top-1/2 -translate-y-1/2 animate-pulse" />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <Link
                        href="/bus-terminal"
                        target="_blank"
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                      >
                        <Scan className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Launch Bus Gate Camera Terminal</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setIsMobileDemoModalOpen(true)}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 border border-cyan-200 text-cyan-900 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
                        <span>📱 Open Scanner on Phone (Same Wi-Fi)</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
                      <span className="text-slate-500 text-[11px]">Stop: {currentFocusedBus.nextStop}</span>
                      <button
                        onClick={() => setActiveTab("attendance")}
                        className="text-slate-900 font-bold hover:underline text-[11px]"
                      >
                        View Ledger →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. STUDENTS MANAGEMENT */}
            {activeTab === "students" && (
              <StudentManagement
                students={students}
                buses={buses}
                parents={parents}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onEnrollFaceSuccess={handleEnrollFaceSuccess}
              />
            )}

            {/* 3. PARENTS MANAGEMENT */}
            {activeTab === "parents" && (
              <ParentManagement
                parents={parents}
                students={students}
                onAddParent={handleAddParent}
                onUpdateParent={handleUpdateParent}
                onDeleteParent={handleDeleteParent}
              />
            )}

            {/* 4. BUSES & FLEET MANAGEMENT */}
            {activeTab === "fleet" && (
              <BusManagement
                buses={buses}
                drivers={drivers}
                routes={routes}
                students={students}
                onAddBus={handleAddBus}
                onUpdateBus={handleUpdateBus}
                onDeleteBus={handleDeleteBus}
                onEmergencyTransfer={handleEmergencyTransfer}
                onNavigateToRoutes={() => setActiveTab("routes")}
              />
            )}

            {/* 5. DRIVERS DIRECTORY */}
            {activeTab === "drivers" && (
              <DriverManagement
                drivers={drivers}
                buses={buses}
                onAddDriver={handleAddDriver}
                onUpdateDriver={handleUpdateDriver}
                onDeleteDriver={handleDeleteDriver}
              />
            )}

            {/* 6. ROUTES & STOPS */}
            {activeTab === "routes" && (
              <RouteManagement
                routes={routes}
                buses={buses}
                students={students}
                onAddRoute={handleAddRoute}
                onUpdateRoute={handleUpdateRoute}
                onDeleteRoute={handleDeleteRoute}
              />
            )}

            {/* 7. ATTENDANCE LEDGER */}
            {activeTab === "attendance" && (
              <AttendanceLedger
                attendanceRecords={attendance}
                buses={buses}
                students={students}
                onAddAttendanceRecord={handleAttendanceRecord}
              />
            )}

            {/* 8. LIVE GPS RADAR MAP */}
            {activeTab === "tracking" && (
              <LiveFleetRadar buses={buses} students={students} />
            )}

            {/* 10. SAFETY & SOS HUB */}
            {activeTab === "alerts" && (
              <AlertManagement
                alerts={alerts}
                buses={buses}
                onResolveAlert={handleResolveAlert}
                onSendBroadcast={handleSendBroadcast}
              />
            )}

            {/* 11. SYSTEM SETTINGS */}
            {activeTab === "settings" && (
              <SystemSettings onResetDatabase={handleResetDatabase} />
            )}
          </ClipPathTransition>

          <AppFooter />
        </main>

        <FloatingIslandNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          criticalAlertCount={criticalAlertCount}
        />
      </div>

      <StudentModal
        isOpen={isQuickAddStudentOpen}
        onClose={() => setIsQuickAddStudentOpen(false)}
        onSave={(data) => {
          const newStudent: Student = {
            id: `stu-${Date.now()}`,
            name: data.name || "Student",
            rollNo: data.rollNo || "STU-000",
            grade: data.grade || "Grade 10",
            section: data.section || "A",
            address: data.address || "Address",
            busId: data.busId || buses[0]?.id || "",
            busNumber: data.busNumber || "Bus #14",
            routeName: data.routeName || "Route",
            parentId: data.parentId || parents[0]?.id || "",
            parentName: data.parentName || "Parent",
            parentPhone: data.parentPhone || "+91 98765 43210",
            status: "WAITING",
            lastCheckin: "Pending",
            avatarUrl:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            faceRegistered: false,
          };
          handleAddStudent(newStudent);
        }}
        buses={buses}
        parents={parents}
        students ={students}
      />

      <MobileDemoModal
        isOpen={isMobileDemoModalOpen}
        onClose={() => setIsMobileDemoModalOpen(false)}
        localIp="192.168.1.12"
      />
    </SmoothScrollProvider>
  );
}
