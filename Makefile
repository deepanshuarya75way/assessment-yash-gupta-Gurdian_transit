.PHONY: up down restart logs migrate build help

help:
	@echo "Guardian Transit AI - Control Commands"
	@echo "  make up       - Start Database, Backend, and Frontend (1-command)"
	@echo "  make down     - Stop all services and containers"
	@echo "  make restart  - Restart all containers"
	@echo "  make logs     - Follow logs of all running containers"
	@echo "  make build    - Rebuild and start all containers"
	@echo "  make migrate  - Run Alembic schema migrations"

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

build:
	docker compose up --build -d

migrate:
	docker compose exec backend alembic -c backend/alembic.ini upgrade head
