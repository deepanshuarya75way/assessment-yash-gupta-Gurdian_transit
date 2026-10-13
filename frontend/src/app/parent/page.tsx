"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { ParentMobileApp } from "../../components/parent/ParentMobileApp";
import { ParentLoginView } from "../../components/auth/ParentLoginView";
import { ApiClient } from "../../services/apiClient";
import {
  Student,
  Parent,
  Bus,
  Route,
  SafetyAlert,
  SEED_STUDENTS,
  SEED_PARENTS,
  SEED_BUSES,
  SEED_ROUTES,
  SEED_ALERTS,
} from "../../data/enterpriseMockData";
import { ShieldAlert, LogOut, PhoneCall } from "lucide-react";

export default function ParentDashboardPage() {
  const {
    parentUser,
    isParentAuthenticated,
    isLoading,
    logoutParent,
    activeStudentId,
    switchActiveStudent,
    refreshSession,
  } = useAuth();

  const [allStudents, setAllStudents] = useState<Student[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("guardian_students");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return SEED_STUDENTS;
  });

  const [allParents, setAllParents] = useState<Parent[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("guardian_parents");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return SEED_PARENTS;
  });

  const [allBuses, setAllBuses] = useState<Bus[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("guardian_buses");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return SEED_BUSES;
  });

  const [allRoutes, setAllRoutes] = useState<Route[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("guardian_routes");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return SEED_ROUTES;
  });

  const [allAlerts, setAllAlerts] = useState<SafetyAlert[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("guardian_alerts");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return SEED_ALERTS;
  });

  // Load live data from Backend / LocalStorage
  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        const [apiStudents, apiParents, apiBuses, apiRoutes, apiAlerts] = await Promise.all([
          ApiClient.getStudents(),
          ApiClient.getParents(),
          ApiClient.getBuses(),
          ApiClient.getRoutes(),
          ApiClient.getAlerts(),
        ]);
        if (apiStudents && apiStudents.length > 0) {
          setAllStudents(apiStudents);
          try { localStorage.setItem("guardian_students", JSON.stringify(apiStudents)); } catch {}
        }
        if (apiParents && apiParents.length > 0) {
          setAllParents(apiParents);
          try { localStorage.setItem("guardian_parents", JSON.stringify(apiParents)); } catch {}
        }
        if (apiBuses && apiBuses.length > 0) {
          setAllBuses(apiBuses);
          try { localStorage.setItem("guardian_buses", JSON.stringify(apiBuses)); } catch {}
        }
        if (apiRoutes && apiRoutes.length > 0) {
          setAllRoutes(apiRoutes);
          try { localStorage.setItem("guardian_routes", JSON.stringify(apiRoutes)); } catch {}
        }
        if (apiAlerts && apiAlerts.length > 0) {
          setAllAlerts(apiAlerts);
          try { localStorage.setItem("guardian_alerts", JSON.stringify(apiAlerts)); } catch {}
        }
        if (refreshSession && isParentAuthenticated && parentUser) {
          await refreshSession();
        }
      } catch (e) {
        console.warn("Backend API sync in parent portal skipped:", e);
      }
    };
    fetchFreshData();
  }, [refreshSession]);

  // Listen to cross-component data updates
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const cachedStudents = localStorage.getItem("guardian_students");
        const cachedParents = localStorage.getItem("guardian_parents");
        const cachedBuses = localStorage.getItem("guardian_buses");
        const cachedRoutes = localStorage.getItem("guardian_routes");
        const cachedAlerts = localStorage.getItem("guardian_alerts");
        if (cachedStudents) setAllStudents(JSON.parse(cachedStudents));
        if (cachedParents) setAllParents(JSON.parse(cachedParents));
        if (cachedBuses) setAllBuses(JSON.parse(cachedBuses));
        if (cachedRoutes) setAllRoutes(JSON.parse(cachedRoutes));
        if (cachedAlerts) setAllAlerts(JSON.parse(cachedAlerts));
      } catch {}
    };

    window.addEventListener("guardian_data_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("guardian_data_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Filter students linked exclusively to this parent
  const myStudents = useMemo(() => {
    if (!parentUser) return [];

    const parentNameLower = (parentUser.name || "").trim().toLowerCase();
    const parentId = parentUser.id || "";
    const linkedIds = parentUser.parentData?.linkedStudentIds || [];

    const matched = allStudents.filter((s) => {
      const sParentName = (s.parentName || "").trim().toLowerCase();
      const sParentId = s.parentId || "";
      return (
        (sParentId && sParentId === parentId) ||
        (sParentName && sParentName === parentNameLower) ||
        linkedIds.includes(s.id) ||
        (parentUser.students && parentUser.students.some((us) => us.id === s.id))
      );
    });

    if (matched.length > 0) return matched;
    if (parentUser.students && parentUser.students.length > 0) return parentUser.students;
    return [];
  }, [allStudents, parentUser]);

  // Always resolve the FRESH student object with up-to-date bus assignment
  const currentStudent = useMemo(() => {
    if (myStudents.length === 0) return null;
    if (activeStudentId) {
      const found = myStudents.find((s) => s.id === activeStudentId);
      if (found) return found;
    }
    return myStudents[0];
  }, [myStudents, activeStudentId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-slate-400">
            Securing Guardian Transit Parent Mesh...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated as Parent, render dedicated White 3D Parent Login
  if (!isParentAuthenticated || !parentUser) {
    return <ParentLoginView />;
  }

  // If parent account exists but no child is linked yet, show protected empty state
  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              No Student Linked to Account
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Logged in as <strong className="text-slate-800">{parentUser.name}</strong> ({parentUser.email || parentUser.phone}). No student records were found linked to your profile in the school registry.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs space-y-1.5 text-slate-600">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-black" />
              <span>Contact School Transport Admin:</span>
            </div>
            <p>• Transport Helpline: <strong>+91 98112 00100</strong></p>
            <p>• Ask administration to assign student to parent &quot;{parentUser.name}&quot;.</p>
          </div>

          <button
            onClick={logoutParent}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <ParentMobileApp
      user={parentUser}
      onLogout={logoutParent}
      activeStudent={currentStudent}
      myStudents={myStudents}
      allStudents={allStudents}
      allParents={allParents}
      allBuses={allBuses}
      allRoutes={allRoutes}
      allAlerts={allAlerts}
      onSwitchStudent={switchActiveStudent}
    />
  );
}
