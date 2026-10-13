import json
import asyncio
from typing import Dict, List, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/ws", tags=["Real-Time WebSockets"])

class WebSocketConnectionManager:
    def __init__(self):
        # Global active connections
        self.active_connections: Set[WebSocket] = set()
        # Parent-specific connections: parent_id -> Set[WebSocket]
        self.parent_connections: Dict[str, Set[WebSocket]] = {}
        # Bus-specific telemetry listeners: bus_number -> Set[WebSocket]
        self.bus_listeners: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, parent_id: str = None, bus_number: str = None):
        await websocket.accept()
        self.active_connections.add(websocket)
        
        if parent_id:
            if parent_id not in self.parent_connections:
                self.parent_connections[parent_id] = set()
            self.parent_connections[parent_id].add(websocket)

        if bus_number:
            if bus_number not in self.bus_listeners:
                self.bus_listeners[bus_number] = set()
            self.bus_listeners[bus_number].add(websocket)

    def disconnect(self, websocket: WebSocket, parent_id: str = None, bus_number: str = None):
        self.active_connections.discard(websocket)
        
        if parent_id and parent_id in self.parent_connections:
            self.parent_connections[parent_id].discard(websocket)
            if not self.parent_connections[parent_id]:
                del self.parent_connections[parent_id]

        if bus_number and bus_number in self.bus_listeners:
            self.bus_listeners[bus_number].discard(websocket)
            if not self.bus_listeners[bus_number]:
                del self.bus_listeners[bus_number]

    async def broadcast_all(self, message: dict):
        """Broadcast an event to all connected clients (Admin & Parent dashboards)"""
        dead_connections = set()
        payload = json.dumps(message)
        for connection in self.active_connections:
            try:
                await connection.send_text(payload)
            except Exception:
                dead_connections.add(connection)
        
        for dead in dead_connections:
            self.active_connections.discard(dead)

    async def send_to_parent(self, parent_id: str, message: dict):
        """Send a real-time event directly to a specific parent"""
        payload = json.dumps(message)
        if parent_id in self.parent_connections:
            dead = set()
            for connection in self.parent_connections[parent_id]:
                try:
                    await connection.send_text(payload)
                except Exception:
                    dead.add(connection)
            for d in dead:
                self.parent_connections[parent_id].discard(d)
        
        # Also forward to global admin broadcast
        await self.broadcast_all(message)

    async def broadcast_bus_telemetry(self, bus_number: str, telemetry: dict):
        """Broadcast live moving coordinates of a specific bus"""
        payload = json.dumps(telemetry)
        if bus_number in self.bus_listeners:
            dead = set()
            for connection in self.bus_listeners[bus_number]:
                try:
                    await connection.send_text(payload)
                except Exception:
                    dead.add(connection)
            for d in dead:
                self.bus_listeners[bus_number].discard(d)
        
        await self.broadcast_all(telemetry)

# Global Singleton Manager instance
ws_manager = WebSocketConnectionManager()

@router.websocket("/live")
async def websocket_live_endpoint(websocket: WebSocket):
    """Global real-time broadcast stream for all alerts, SOS, and transit events"""
    await ws_manager.connect(websocket)
    try:
        # Send initial welcome confirmation
        await websocket.send_text(json.dumps({
            "type": "CONNECTION_ESTABLISHED",
            "message": "Guardian Transit AI Real-Time WebSocket Mesh Online",
            "timestamp": int(asyncio.get_event_loop().time()),
        }))
        while True:
            data = await websocket.receive_text()
            # Echo ping/pong heartbeat
            try:
                parsed = json.loads(data)
                if parsed.get("type") == "PING":
                    await websocket.send_text(json.dumps({"type": "PONG", "timestamp": parsed.get("timestamp")}))
            except Exception:
                pass
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)

@router.websocket("/parent/{parent_id}")
async def websocket_parent_endpoint(websocket: WebSocket, parent_id: str):
    """Dedicated WebSocket channel for an individual parent's dashboard"""
    await ws_manager.connect(websocket, parent_id=parent_id)
    try:
        await websocket.send_text(json.dumps({
            "type": "PARENT_CHANNEL_CONNECTED",
            "parentId": parent_id,
            "message": f"Connected to private transit safety feed for parent {parent_id}",
        }))
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, parent_id=parent_id)
    except Exception:
        ws_manager.disconnect(websocket, parent_id=parent_id)
