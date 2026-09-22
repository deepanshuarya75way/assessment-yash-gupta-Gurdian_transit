import { Student, Parent, Bus, Route, AttendanceRecord, SafetyAlert } from "../data/enterpriseMockData";

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return `http://${window.location.hostname}:8000/api/v1`;
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
};

export class ApiClient {
  // Check backend server health
  static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/health`, { method: "GET", cache: "no-store" });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- STUDENTS ---
  static async getStudents(): Promise<Student[] | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/students`, { method: "GET", cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  static async createStudent(student: Omit<Student, "id">): Promise<Student | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  static async deleteStudent(studentId: string): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/students/${studentId}`, {
        method: "DELETE",
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- PARENTS ---
  static async getParents(): Promise<Parent[] | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/parents`, { method: "GET", cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  static async createParent(parent: Omit<Parent, "id">): Promise<Parent | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/parents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parent),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  static async deleteParent(parentId: string): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/parents/${parentId}`, {
        method: "DELETE",
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- BUSES ---
  static async getBuses(): Promise<Bus[] | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/buses`, { method: "GET", cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  static async transferFleet(
    sourceBusId: string,
    targetBusId: string,
    reason: string,
    notifyParents: boolean = true
  ): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/buses/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceBusId, targetBusId, reason, notifyParents }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- ROUTES ---
  static async getRoutes(): Promise<Route[] | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/routes`, { method: "GET", cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  // --- ATTENDANCE ---
  static async getAttendance(): Promise<AttendanceRecord[] | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/attendance`, { method: "GET", cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  static async recordAttendance(record: Omit<AttendanceRecord, "id">): Promise<AttendanceRecord | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/attendance/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  // --- ALERTS ---
  static async getAlerts(): Promise<SafetyAlert[] | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/alerts`, { method: "GET", cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  static async broadcastSos(alert: Omit<SafetyAlert, "id">): Promise<SafetyAlert | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/alerts/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alert),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  static async resolveAlert(alertId: string): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/alerts/${alertId}/resolve`, {
        method: "PUT",
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- BIOMETRICS ---
  static async registerFaceBiometrics(data: {
    studentId?: string;
    studentName?: string;
    rollNo?: string;
    capturedPhoto: string;
    angleCaptures?: string[];
  }): Promise<{ success: boolean; qualityScore: number; embeddingDimension: number; message: string } | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/biometrics/register-face`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  static async verifyFaceBiometrics(data: {
    image: string;
    busNumber?: string;
    persona?: string;
    shift?: string;
    stopLocation?: string;
  }): Promise<any | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/biometrics/verify-face`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  static async parseIdCard(data: {
    frontImage: string;
    backImage?: string;
    rawFrontText?: string;
    rawBackText?: string;
  }): Promise<any | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/biometrics/parse-id-card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}
