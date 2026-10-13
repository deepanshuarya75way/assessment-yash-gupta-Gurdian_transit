import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models.database import init_db, AsyncSessionLocal
from .models.seed_data import seed_database_if_empty

from .routers import students, buses, parents, routes, attendance, alerts, telemetry, biometrics, ws

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB Schema and Seed asynchronously on startup
    await init_db()
    async with AsyncSessionLocal() as db:
        try:
            await seed_database_if_empty(db)
        except Exception as e:
            print(f"[Warning] Seeding error on startup: {e}")
    yield
    # Cleanup on shutdown (if any)

app = FastAPI(
    title="Guardian Transit AI - Enterprise Backend API",
    description="Real-Time AI Biometric School Bus Transit Safety & Telemetry Control Engine (Async SQLAlchemy 2.0 + Alembic)",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Enable CORS for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Sub-Routers
app.include_router(students.router, prefix="/api/v1")
app.include_router(buses.router, prefix="/api/v1")
app.include_router(parents.router, prefix="/api/v1")
app.include_router(routes.router, prefix="/api/v1")
app.include_router(attendance.router, prefix="/api/v1")
app.include_router(alerts.router, prefix="/api/v1")
app.include_router(telemetry.router, prefix="/api/v1")
app.include_router(biometrics.router, prefix="/api/v1")
app.include_router(ws.router, prefix="/api/v1")
app.include_router(ws.router)

@app.get("/")
def root():
    return {
        "system": "Guardian Transit AI Backend Engine",
        "status": "ONLINE",
        "version": "2.0.0 (Async SQLAlchemy 2.0)",
        "docs": "/docs",
    }

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "HEALTHY",
        "orm": "SQLAlchemy 2.0 (Async)",
        "migrations": "Alembic",
        "database": "PostgreSQL / SQLite Compatible",
        "biometricsEngine": "ONLINE",
        "telemetryStream": "ACTIVE",
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
