"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface LiveWebSocketEvent {
  type: "SAFETY_ALERT" | "ATTENDANCE_EVENT" | "BUS_TELEMETRY" | "CONNECTION_ESTABLISHED" | "PARENT_CHANNEL_CONNECTED";
  title?: string;
  parentId?: string;
  timestamp?: number;
  data?: any;
}

export function useParentWebSocket(parentId?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<LiveWebSocketEvent[]>([]);
  const [latestTelemetry, setLatestTelemetry] = useState<any>(null);
  const [latestAttendance, setLatestAttendance] = useState<any>(null);
  const [latestAlert, setLatestAlert] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;

    // Determine WebSocket URL from current host or environment
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.hostname || "localhost";
    const port = "8000"; // FastAPI port
    const url = parentId
      ? `${protocol}//${host}:${port}/api/v1/ws/parent/${parentId}`
      : `${protocol}//${host}:${port}/api/v1/ws/live`;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as LiveWebSocketEvent;
          setEvents((prev) => [parsed, ...prev.slice(0, 49)]);

          if (parsed.type === "SAFETY_ALERT") {
            setLatestAlert(parsed.data);
          } else if (parsed.type === "ATTENDANCE_EVENT") {
            setLatestAttendance(parsed.data);
          } else if (parsed.type === "BUS_TELEMETRY") {
            setLatestTelemetry(parsed.data);
          }
        } catch (e) {
          console.error("Failed to parse incoming WebSocket message:", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Automatic exponential backoff reconnection
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch (err) {
      console.warn("WebSocket connection attempt error:", err);
    }
  }, [parentId]);

  useEffect(() => {
    connect();

    // Heartbeat ping interval
    const pingInterval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "PING", timestamp: Date.now() }));
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  return {
    isConnected,
    events,
    latestTelemetry,
    latestAttendance,
    latestAlert,
  };
}
