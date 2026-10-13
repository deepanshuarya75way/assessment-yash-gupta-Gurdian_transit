"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ApiClient } from "../services/apiClient";
import { SEED_PARENTS, SEED_STUDENTS, SEED_BUSES, Parent, Student, Bus } from "../data/enterpriseMockData";

export type UserRole = "ADMIN" | "PARENT" | "DRIVER";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  parentData?: Parent;
  students?: Student[];
  primaryBus?: Bus;
  token?: string;
}

export interface DemoPersona {
  id: string;
  label: string;
  subLabel: string;
  role: UserRole;
  email: string;
  password?: string;
  avatar: string;
  badge: string;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "admin-demo",
    label: "Super Admin",
    subLabel: "Full Enterprise Control Center",
    role: "ADMIN",
    email: "admin@guardiantransit.ai",
    password: "admin123",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    badge: "Admin Access",
  },
  {
    id: "parent-vinay",
    label: "Mr. Vinay Gupta",
    subLabel: "Parent of Ria & Yash Gupta (PIN: GT-8423)",
    role: "PARENT",
    email: "vinay.gupta@example.com",
    password: "GT-8423",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    badge: "PIN: GT-8423",
  },
  {
    id: "parent-yash",
    label: "Mr. Sanjay Gupta",
    subLabel: "Parent of Gaurav Gupta (PIN: GT-9944)",
    role: "PARENT",
    email: "sanjay.gupta@example.com",
    password: "GT-9944",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    badge: "PIN: GT-9944",
  },
  {
    id: "parent-ananya",
    label: "Kavita Verma",
    subLabel: "Parent of Ananya Verma (PIN: GT-7718)",
    role: "PARENT",
    email: "kavita.verma@example.com",
    password: "GT-7718",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    badge: "PIN: GT-7718",
  },
];

interface AuthContextType {
  user: AuthUser | null;
  adminUser: AuthUser | null;
  parentUser: AuthUser | null;
  driverUser: AuthUser | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isParentAuthenticated: boolean;
  isDriverAuthenticated: boolean;
  isLoading: boolean;
  login: (role: UserRole, identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginParent: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (personaId: string) => Promise<boolean>;
  logout: (role?: UserRole) => void;
  logoutAdmin: () => void;
  logoutParent: () => void;
  logoutDriver: () => void;
  switchActiveStudent?: (studentId: string) => void;
  activeStudent?: Student | null;
  activeStudentId?: string | null;
  refreshSession?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Distinct storage keys for zero cross-role collisions
const AUTH_ADMIN_KEY = "guardian_admin_session";
const AUTH_PARENT_KEY = "guardian_parent_session";
const AUTH_DRIVER_KEY = "guardian_bus_session";
const AUTH_LEGACY_KEY = "guardian_transit_auth_session";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AuthUser | null>(null);
  const [parentUser, setParentUser] = useState<AuthUser | null>(null);
  const [driverUser, setDriverUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const router = useRouter();

  const buildParentUser = (
    parent: Parent,
    customStudents?: Student[],
    customBuses?: Bus[]
  ): AuthUser => {
    let studentPool: Student[] = customStudents && customStudents.length > 0 ? customStudents : [];
    if (studentPool.length === 0) {
      try {
        const cached = localStorage.getItem("guardian_students");
        if (cached) studentPool = JSON.parse(cached);
      } catch {}
    }
    if (studentPool.length === 0) {
      studentPool = SEED_STUDENTS;
    }

    let busPool: Bus[] = customBuses && customBuses.length > 0 ? customBuses : [];
    if (busPool.length === 0) {
      try {
        const cached = localStorage.getItem("guardian_buses");
        if (cached) busPool = JSON.parse(cached);
      } catch {}
    }
    if (busPool.length === 0) {
      busPool = SEED_BUSES;
    }

    const parentNameLower = (parent.name || "").trim().toLowerCase();
    const parentId = parent.id;
    const linkedIds = parent.linkedStudentIds || [];

    const linkedStudents = studentPool.filter((s) => {
      const sParentName = (s.parentName || "").trim().toLowerCase();
      const sParentId = s.parentId || "";
      return (
        (sParentId && sParentId === parentId) ||
        (sParentName && sParentName === parentNameLower) ||
        linkedIds.includes(s.id)
      );
    });

    const firstBusId = linkedStudents[0]?.busId;
    const firstBusNum = linkedStudents[0]?.busNumber;
    const bus =
      busPool.find((b) => b.id === firstBusId || b.busNumber === firstBusNum) || busPool[0];

    return {
      id: parent.id,
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
      role: "PARENT",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      parentData: parent,
      students: linkedStudents,
      primaryBus: bus,
      token: `jwt-parent-${parent.id}-${Date.now()}`,
    };
  };

  const syncParentSession = async (currentParent?: AuthUser | null) => {
    // If not currently logged in, abort immediately
    if (typeof window !== "undefined" && !localStorage.getItem(AUTH_PARENT_KEY)) {
      return;
    }

    const targetParent = currentParent || parentUser;
    if (!targetParent || targetParent.role !== "PARENT") return;

    try {
      const [apiStudents, apiParents, apiBuses] = await Promise.all([
        ApiClient.getStudents(),
        ApiClient.getParents(),
        ApiClient.getBuses(),
      ]);

      // Check again after async fetch: if parent logged out while fetching, abort!
      if (typeof window !== "undefined" && !localStorage.getItem(AUTH_PARENT_KEY)) {
        return;
      }

      let studentPool = apiStudents && apiStudents.length > 0 ? apiStudents : [];
      let parentPool = apiParents && apiParents.length > 0 ? apiParents : [];
      let busPool = apiBuses && apiBuses.length > 0 ? apiBuses : [];

      if (studentPool.length === 0) {
        try {
          const cached = localStorage.getItem("guardian_students");
          if (cached) studentPool = JSON.parse(cached);
        } catch {}
      }
      if (parentPool.length === 0) {
        try {
          const cached = localStorage.getItem("guardian_parents");
          if (cached) parentPool = JSON.parse(cached);
        } catch {}
      }
      if (busPool.length === 0) {
        try {
          const cached = localStorage.getItem("guardian_buses");
          if (cached) busPool = JSON.parse(cached);
        } catch {}
      }

      const parentNameLower = (targetParent.name || "").trim().toLowerCase();
      const matchedParent =
        parentPool.find(
          (p: Parent) =>
            p.id === targetParent.id ||
            (p.name && p.name.trim().toLowerCase() === parentNameLower)
        ) || targetParent.parentData;

      if (matchedParent && typeof window !== "undefined" && localStorage.getItem(AUTH_PARENT_KEY)) {
        const updatedUser = buildParentUser(matchedParent, studentPool, busPool);
        setParentUser(updatedUser);
        try {
          localStorage.setItem(AUTH_PARENT_KEY, JSON.stringify(updatedUser));
        } catch {}
      }
    } catch (e) {
      console.warn("Parent session live re-sync skipped:", e);
    }
  };

  // Load distinct sessions from localStorage on mount
  useEffect(() => {
    try {
      // 1. Admin session
      const storedAdmin = localStorage.getItem(AUTH_ADMIN_KEY);
      if (storedAdmin) {
        setAdminUser(JSON.parse(storedAdmin) as AuthUser);
      }

      // 2. Parent session
      const storedParent = localStorage.getItem(AUTH_PARENT_KEY);
      if (storedParent) {
        const parsed = JSON.parse(storedParent) as AuthUser;
        setParentUser(parsed);
        if (parsed.students && parsed.students.length > 0) {
          setActiveStudentId(parsed.students[0].id);
        }
        syncParentSession(parsed);
      }

      // 3. Driver session
      const storedDriver = localStorage.getItem(AUTH_DRIVER_KEY);
      if (storedDriver) {
        setDriverUser(JSON.parse(storedDriver) as AuthUser);
      }

      // 4. Always clean any legacy session keys to prevent old ghost logins
      try {
        localStorage.removeItem(AUTH_LEGACY_KEY);
      } catch {}
    } catch (e) {
      console.error("Failed to restore auth sessions:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for live data updates across components/tabs
  useEffect(() => {
    const handleDataUpdate = () => {
      syncParentSession();
    };

    window.addEventListener("guardian_data_updated", handleDataUpdate);
    window.addEventListener("storage", handleDataUpdate);

    return () => {
      window.removeEventListener("guardian_data_updated", handleDataUpdate);
      window.removeEventListener("storage", handleDataUpdate);
    };
  }, [parentUser?.id]);

  const loginAdmin = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const cleanEmail = email.trim().toLowerCase();
      const inputPass = (password || "").trim();

      const isAdminUser = !cleanEmail || cleanEmail === "admin" || cleanEmail === "admin@guardiantransit.ai" || cleanEmail.includes("admin");
      const isAdminPass = inputPass === "admin123" || inputPass === "admin" || !inputPass;

      if (isAdminUser && isAdminPass) {
        const adminObj: AuthUser = {
          id: "adm-001",
          name: "Yash Sharma (Director)",
          email: "admin@guardiantransit.ai",
          role: "ADMIN",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          token: `jwt-admin-${Date.now()}`,
        };
        setAdminUser(adminObj);
        localStorage.setItem(AUTH_ADMIN_KEY, JSON.stringify(adminObj));
        return { success: true };
      }
      return { success: false, error: "Invalid Admin credentials. Use admin@guardiantransit.ai / admin123" };
    } finally {
      setIsLoading(false);
    }
  };

  const loginParent = async (identifier: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const cleanIdentifier = identifier.trim().toLowerCase();
      const inputPassword = (password || "").trim();

      let allParents: Parent[] = [];
      let allStudents: Student[] = [];
      let allBuses: Bus[] = [];

      try {
        const [apiParents, apiStudents, apiBuses] = await Promise.all([
          ApiClient.getParents(),
          ApiClient.getStudents(),
          ApiClient.getBuses(),
        ]);
        if (apiParents && apiParents.length > 0) allParents = apiParents;
        if (apiStudents && apiStudents.length > 0) allStudents = apiStudents;
        if (apiBuses && apiBuses.length > 0) allBuses = apiBuses;
      } catch {}

      if (allParents.length === 0) {
        try {
          const cached = localStorage.getItem("guardian_parents");
          if (cached) allParents = JSON.parse(cached);
        } catch {}
        if (allParents.length === 0) allParents = SEED_PARENTS;
      }

      const cleanDigits = cleanIdentifier.replace(/\D/g, "");
      let matchedParent: Parent | undefined = undefined;

      if (cleanIdentifier.includes("@")) {
        matchedParent = allParents.find((p) => p.email?.trim().toLowerCase() === cleanIdentifier);
      }
      if (!matchedParent && cleanDigits.length >= 7) {
        matchedParent = allParents.find((p) => {
          const pDigits = (p.phone || "").replace(/\D/g, "");
          return pDigits === cleanDigits || (cleanDigits.length >= 10 && pDigits.endsWith(cleanDigits)) || (pDigits.length >= 10 && cleanDigits.endsWith(pDigits));
        });
      }
      if (!matchedParent) {
        matchedParent = allParents.find((p) => p.name?.trim().toLowerCase() === cleanIdentifier);
      }
      if (!matchedParent && cleanIdentifier.includes(".")) {
        const userPrefix = cleanIdentifier.split("@")[0].trim().toLowerCase();
        matchedParent = allParents.find((p) => p.email?.split("@")[0].trim().toLowerCase() === userPrefix);
      }

      if (!matchedParent) {
        return {
          success: false,
          error: `No registered Parent found for "${identifier}". Please check your email/mobile registered with the school.`,
        };
      }

      if (!inputPassword) {
        return { success: false, error: "Security PIN or Password is required to log in." };
      }

      const expectedPassword = (matchedParent.password || "").trim();
      if (inputPassword !== expectedPassword) {
        return { success: false, error: "Incorrect Security PIN. Please verify your PIN (e.g. GT-8423)." };
      }

      const parentUserObj = buildParentUser(matchedParent, allStudents, allBuses);
      setParentUser(parentUserObj);
      if (parentUserObj.students && parentUserObj.students.length > 0) {
        setActiveStudentId(parentUserObj.students[0].id);
      }
      localStorage.setItem(AUTH_PARENT_KEY, JSON.stringify(parentUserObj));
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (role: UserRole, identifier: string, password?: string) => {
    if (role === "ADMIN") {
      return loginAdmin(identifier, password);
    }
    if (role === "PARENT") {
      return loginParent(identifier, password);
    }
    return { success: false, error: "Unsupported role" };
  };

  const loginAsDemo = async (personaId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (personaId === "admin-demo") {
        return (await loginAdmin("admin@guardiantransit.ai", "admin123")).success;
      }

      let allParents: Parent[] = [];
      try {
        const apiP = await ApiClient.getParents();
        if (apiP && apiP.length > 0) allParents = apiP;
      } catch {}
      if (allParents.length === 0) {
        try {
          const cached = localStorage.getItem("guardian_parents");
          if (cached) allParents = JSON.parse(cached);
        } catch {}
      }
      if (allParents.length === 0) allParents = SEED_PARENTS;

      let matchedParent: Parent | undefined;
      if (personaId === "parent-vinay") {
        matchedParent = allParents.find(
          (p) => p.email?.toLowerCase().includes("vinay.gupta") || p.name.toLowerCase().includes("vinay")
        );
      } else if (personaId === "parent-yash") {
        matchedParent = allParents.find(
          (p) => p.id === "par-yash" || p.email?.toLowerCase().includes("sanjay.gupta") || p.name.toLowerCase().includes("sanjay gupta")
        );
      } else if (personaId === "parent-ananya") {
        matchedParent = allParents.find(
          (p) => p.id === "par-102" || p.name.toLowerCase().includes("kavita")
        );
      }

      if (!matchedParent) matchedParent = allParents[0];

      const parentUserObj = buildParentUser(matchedParent);
      setParentUser(parentUserObj);
      if (parentUserObj.students && parentUserObj.students.length > 0) {
        setActiveStudentId(parentUserObj.students[0].id);
      }
      localStorage.setItem(AUTH_PARENT_KEY, JSON.stringify(parentUserObj));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem(AUTH_ADMIN_KEY);
      localStorage.removeItem(AUTH_LEGACY_KEY);
      localStorage.removeItem("guardian_user");
    } catch {}
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guardian_auth_logout"));
    }
  };

  const logoutParent = () => {
    setParentUser(null);
    setActiveStudentId(null);
    try {
      localStorage.removeItem(AUTH_PARENT_KEY);
      localStorage.removeItem(AUTH_LEGACY_KEY);
      localStorage.removeItem("guardian_parent");
      localStorage.removeItem("guardian_user");
    } catch {}
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guardian_auth_logout"));
    }
  };

  const logoutDriver = () => {
    setDriverUser(null);
    try {
      localStorage.removeItem(AUTH_DRIVER_KEY);
      localStorage.removeItem(AUTH_LEGACY_KEY);
    } catch {}
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guardian_auth_logout"));
    }
  };

  const logout = (role?: UserRole) => {
    if (role === "ADMIN") logoutAdmin();
    else if (role === "PARENT") logoutParent();
    else if (role === "DRIVER") logoutDriver();
    else {
      logoutAdmin();
      logoutParent();
      logoutDriver();
    }
  };

  const activeStudent =
    (activeStudentId ? parentUser?.students?.find((s) => s.id === activeStudentId) : null) ||
    parentUser?.students?.[0] ||
    null;

  return (
    <AuthContext.Provider
      value={{
        user: adminUser || parentUser || driverUser || null,
        adminUser,
        parentUser,
        driverUser,
        isAuthenticated: !!(adminUser || parentUser || driverUser),
        isAdminAuthenticated: !!adminUser,
        isParentAuthenticated: !!parentUser,
        isDriverAuthenticated: !!driverUser,
        isLoading,
        login,
        loginAdmin,
        loginParent,
        loginAsDemo,
        logout,
        logoutAdmin,
        logoutParent,
        logoutDriver,
        switchActiveStudent: (id: string) => setActiveStudentId(id),
        activeStudent,
        activeStudentId,
        refreshSession: () => syncParentSession(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
