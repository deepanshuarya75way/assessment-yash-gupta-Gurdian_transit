# 🛡️ Guardian Transit AI

> **Real-Time AI Biometric School Bus Transit Safety & Telemetry Control Engine**

Guardian Transit AI is a full-stack, enterprise-grade school bus transit safety platform featuring AI-powered facial biometric attendance verification, live GPS vehicle tracking, emergency fleet dispatch re-routing, automated safety alert broadcasts, and comprehensive parent-student telematics.

---

## 🏗️ Architecture & Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Leaflet Maps
- **Backend API:** FastAPI (Python 3.11), Asynchronous REST Endpoints, Uvicorn
- **Database & ORM:** PostgreSQL 16 with `pgvector` extension, Async SQLAlchemy 2.0 (`asyncpg` + `AsyncSession`)
- **Schema Migrations:** Alembic (Automatic database migrations on container startup)
- **DevOps & Containers:** Docker & Docker Compose (1-command multi-container orchestration)

---

## 🚀 Quick Start (1-Command Run)

### Prerequisites
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) installed and running.

### 1. Run the entire stack:
```bash
docker compose up --build -d
```
*(Or use `make up` / `make build`)*

This single command automatically:
1. Provisions **PostgreSQL 16** with `pgvector`.
2. Runs **Alembic database migrations** to create tables.
3. Automatically **seeds initial data** (112 students, 8 buses, routes, parents, telemetry).
4. Launches the **FastAPI Async Backend** on port `8000`.
5. Starts the **Next.js Frontend** on port `3000`.

---

## 🌐 Live Access Endpoints

| Service | Component | URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Next.js 14 Dashboard | [http://localhost:3000](http://localhost:3000) |
| **Backend API Docs** | Swagger UI | [http://localhost:8000/docs](http://localhost:8000/docs) |
| **Backend API Docs** | ReDoc | [http://localhost:8000/redoc](http://localhost:8000/redoc) |
| **Health Check** | API Status & Diagnostics | [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health) |
| **Database** | PostgreSQL | `localhost:5432` (`guardian_transit_db`) |

---

## 🛠️ Management Commands

```bash
# View live logs from all services:
docker compose logs -f

# View backend logs only:
docker compose logs -f backend

# Stop all services:
docker compose down

# Restart all services:
docker compose restart
```

---

## 📁 Repository Structure

```
├── backend/
│   ├── alembic/              # Alembic database migration scripts & versions
│   ├── alembic.ini           # Alembic configuration
│   ├── Dockerfile            # Backend container definition
│   ├── main.py               # FastAPI application entrypoint & lifespan
│   ├── models/               # Async SQLAlchemy 2.0 models & seed data
│   ├── requirements.txt      # Python dependencies (FastAPI, asyncpg, Alembic)
│   ├── routers/              # API sub-routers (students, buses, attendance, etc.)
│   └── schemas/              # Pydantic schemas & request models
├── frontend/
│   ├── Dockerfile            # Frontend Next.js container definition
│   ├── package.json          # Node dependencies & scripts
│   ├── src/                  # Next.js App, Components, Services, & Data
│   └── .env.example          # Environment variables template
├── docker-compose.yml        # Multi-container orchestration (DB, API, Web)
├── Makefile                  # Helper commands (make up, make down, make logs)
└── README.md                 # Project documentation
```

---

## 🔒 Security & Environment Configuration

Copy `.env.example` in `frontend/` to `.env.local` for custom frontend environment settings:
```bash
cp frontend/.env.example frontend/.env.local
```
*(Confidential environment variables and secret certificates are ignored by git via `.gitignore`)*
