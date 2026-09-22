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

export default function EnterpriseAdminApp() {
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
            // Keep any locally created/modified students not yet in backend
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

  // Student CRUD (with Bidirectional Parent Sync & Database Persistence)
  const handleAddStudent = (student: Student) => {
    setStudents((prev) => [student, ...prev]);

    // Persist to Database
    ApiClient.createStudent(student);

    // Only sync parent if a real parent name was provided
    if (student.parentName && student.parentName !== "No Parent Assigned" && student.parentName.trim() !== "") {
      setParents((prevParents) => {
        const existingParentIndex = prevParents.findIndex(
          (p) => p.id === student.parentId || p.name.trim().toLowerCase() === student.parentName.trim().toLowerCase()
        );

        if (existingParentIndex !== -1) {
          return prevParents.map((p, idx) => {
            if (idx === existingParentIndex) {
              const linkedIds = p.linkedStudentIds || [];
              const linkedNames = p.linkedStudentNames || [];
              return {
                ...p,
                linkedStudentIds: linkedIds.includes(student.id) ? linkedIds : [...linkedIds, student.id],
                linkedStudentNames: linkedNames.includes(student.name) ? linkedNames : [...linkedNames, student.name],
              };
            }
            return p;
          });
        } else {
          const newParent: Parent = {
            id: student.parentId || `par-${Date.now()}`,
            name: student.parentName,
            relation: "Father",
            phone: student.parentPhone || "+91 98765 43210",
            email: `${student.parentName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
            address: student.address || "Delhi NCR",
            emergencyContact: student.parentPhone || "+91 98765 43210",
            occupation: "Guardian",
            linkedStudentIds: [student.id],
            linkedStudentNames: [student.name],
          };
          ApiClient.createParent(newParent);
          return [newParent, ...prevParents];
        }
      });
    }
  };

  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    ApiClient.createStudent(updated);

    // Ensure Parent has this student linked bidirectionally
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
              return {
                ...p,
                name: updated.parentName || p.name,
                phone: updated.parentPhone || p.phone,
                linkedStudentIds: linkedIds.includes(updated.id) ? linkedIds : [...linkedIds, updated.id],
                linkedStudentNames: linkedNames.includes(updated.name) ? linkedNames : [...linkedNames, updated.name],
              };
            } else if (hasStudent) {
              return {
                ...p,
                linkedStudentIds: (p.linkedStudentIds || []).filter((id) => id !== updated.id),
                linkedStudentNames: (p.linkedStudentNames || []).filter((name) => name !== updated.name),
              };
            }
            return p;
          });
        } else {
          // Brand new parent created from student edit
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
          };
          ApiClient.createParent(newParent);
          return [newParent, ...prevParents];
        }
      });
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    ApiClient.deleteStudent(id);

    // Remove deleted student from parents list
    setParents((prev) =>
      prev.map((p) => ({
        ...p,
        linkedStudentIds: (p.linkedStudentIds || []).filter((sid) => sid !== id),
      }))
    );
  };

  const handleEnrollFaceSuccess = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, faceRegistered: true } : s))
    );
  };

  // Parent CRUD (with Bidirectional Student Sync & Database Persistence)
  const handleAddParent = (parent: Parent) => {
    setParents((prev) => [parent, ...prev]);
    ApiClient.createParent(parent);

    // For every student linked to this new parent, update the student's parent details!
    if (parent.linkedStudentIds && parent.linkedStudentIds.length > 0) {
      setStudents((prevStudents) =>
        prevStudents.map((s) => {
          if (parent.linkedStudentIds.includes(s.id)) {
            return {
              ...s,
              parentId: parent.id,
              parentName: parent.name,
              parentPhone: parent.phone,
            };
          }
          return s;
        })
      );
    }
  };

  const handleUpdateParent = (updated: Parent) => {
    setParents((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    ApiClient.createParent(updated);

    // For every student linked to this parent, update student parent info!
    setStudents((prevStudents) =>
      prevStudents.map((s) => {
        if ((updated.linkedStudentIds || []).includes(s.id)) {
          return {
            ...s,
            parentId: updated.id,
            parentName: updated.name,
            parentPhone: updated.phone,
          };
        } else if (s.parentId === updated.id) {
          return {
            ...s,
            parentId: "par-01",
            parentName: "Vikramaditya Sharma",
            parentPhone: "+91 98112 34567",
          };
        }
        return s;
      })
    );
  };

  const handleDeleteParent = (id: string) => {
    setParents((prev) => prev.filter((p) => p.id !== id));
    ApiClient.deleteParent(id);
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

    // 1. Reassign students from source bus to target replacement bus
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

    // 2. Mark source bus as UNSERVICEABLE and update target bus occupancy
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

    // 3. Dispatch Live Safety SOS Broadcast Alert
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

  // Alert Handlers
  const handleResolveAlert = (alertId: string) =>
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a)));
  const handleSendBroadcast = (newAlert: SafetyAlert) =>
    setAlerts((prev) => [newAlert, ...prev]);

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
      {/* 3D WebGL Particle Canvas Background */}
      <WebGlParticleCanvas />

      <div className="min-h-screen relative z-10 flex flex-col font-sans">
        {/* App Top Header */}
        <AppHeader
          activeTab={activeTab}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onTriggerSos={() => setActiveTab("alerts")}
          criticalAlertCount={criticalAlertCount}
          alerts={alerts}
        />

        {/* Main Content Workspace with Animated Clip-Path Transition */}
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

                {/* Multi-Dimensional Live Filter Bar */}
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

                {/* Reactive Student Manifest Table Filtered Result (Wrapped to 8 on Home) */}
                <FilteredManifestView
                  filteredStudents={filteredStudents}
                  totalStudentsCount={students.length}
                  onNavigateToStudents={() => setActiveTab("students")}
                />

                {/* GPS Radar HUD + AI Live CCTV Security Box */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Google Map Telemetry Live Widget (2 Columns) */}
                  <div className="lg:col-span-2">
                    <GoogleMapRadarWidget
                      buses={buses}
                      selectedBusId={selectedBusId}
                      onSelectBus={(id) => setSelectedBusId(id)}
                    />
                  </div>

                  {/* AI Biometric CCTV Scanner Gate (1 Column) */}
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
                        {/* Biometric Scanning Reticle Grid */}
                        <div className="absolute inset-0 border-2 border-emerald-400/40 rounded-xl m-2 pointer-events-none" />
                        <div className="absolute top-3 left-3 text-[10px] font-mono text-emerald-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          FACE_ID: ACTIVE
                        </div>
                        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-emerald-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          FPS: 60.0
                        </div>

                        {/* Scanner Bounding Box */}
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

                    {/* Quick Launch Actions for Demo */}
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

            {/* 2. STUDENTS MANAGEMENT (CRUD) */}
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

            {/* 3. PARENTS MANAGEMENT (CRUD - NO BIOMETRICS) */}
            {activeTab === "parents" && (
              <ParentManagement
                parents={parents}
                students={students}
                onAddParent={handleAddParent}
                onUpdateParent={handleUpdateParent}
                onDeleteParent={handleDeleteParent}
              />
            )}

            {/* 4. BUSES & FLEET MANAGEMENT (CRUD & EMERGENCY TRANSFER) */}
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
              />
            )}

            {/* 5. DRIVERS DIRECTORY (CRUD) */}
            {activeTab === "drivers" && (
              <DriverManagement
                drivers={drivers}
                buses={buses}
                onAddDriver={handleAddDriver}
                onUpdateDriver={handleUpdateDriver}
                onDeleteDriver={handleDeleteDriver}
              />
            )}

            {/* 6. ROUTES & STOPS (CRUD) */}
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

            {/* 7. SPEED & AI SAFETY TELEMATICS */}
            {activeTab === "speed-ai" && <SpeedAndAiSafetyHub buses={buses} />}

            {/* 8. ATTENDANCE LEDGER */}
            {activeTab === "attendance" && (
              <AttendanceLedger
                attendanceRecords={attendance}
                buses={buses}
                students={students}
                onAddAttendanceRecord={(rec) => setAttendance((prev) => [rec, ...prev])}
              />
            )}

            {/* 9. LIVE GPS RADAR MAP */}
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

        {/* Floating Island Navigation Dock */}
        <FloatingIslandNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          criticalAlertCount={criticalAlertCount}
        />
      </div>

      {/* Quick Add Student Modal */}
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
      />

      {/* Mobile Wi-Fi Live Presentation Demo Modal */}
      <MobileDemoModal
        isOpen={isMobileDemoModalOpen}
        onClose={() => setIsMobileDemoModalOpen(false)}
        localIp="192.168.1.12"
      />
    </SmoothScrollProvider>
  );
}
