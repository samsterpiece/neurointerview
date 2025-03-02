# Neurointerview Makefile
# This file provides convenient commands for development

# Variables
DOCKER_COMPOSE = docker-compose

# Default target
.PHONY: help
help:
	@echo "Neurointerview Development Commands:"
	@echo "Backend (Docker):"
	@echo "  make build        - Build backend Docker images"
	@echo "  make up           - Start backend services in the foreground"
	@echo "  make up-d         - Start backend services in the background"
	@echo "  make down         - Stop backend services"
	@echo "  make restart      - Restart backend services"
	@echo "  make logs         - View logs from backend services"
	@echo "  make clean        - Remove all containers and volumes"
	@echo "  make shell-backend - Open a shell in the backend container"
	@echo "  make shell-mongo   - Open a MongoDB shell"
	@echo "  make migrate      - Run database migrations"
	@echo "  make seed         - Seed the database with sample data"
	@echo "  make test-backend  - Run backend tests"
	@echo ""
	@echo "Use 'cd frontend && yarn install' to install frontend dependencies"
	@echo "Use 'cd frontend && yarn start' to start the frontend development server"

# Backend Docker commands
.PHONY: build
build:
	$(DOCKER_COMPOSE) build backend mongo

.PHONY: up
up:
	$(DOCKER_COMPOSE) up backend mongo

.PHONY: up-d
up-d:
	$(DOCKER_COMPOSE) up -d backend mongo

.PHONY: down
down:
	$(DOCKER_COMPOSE) down

.PHONY: restart
restart:
	$(DOCKER_COMPOSE) restart backend mongo

.PHONY: logs
logs:
	$(DOCKER_COMPOSE) logs -f backend mongo

.PHONY: clean
clean:
	$(DOCKER_COMPOSE) down -v --remove-orphans

# Backend utility commands
.PHONY: shell-backend
shell-backend:
	$(DOCKER_COMPOSE) exec backend /bin/bash || $(DOCKER_COMPOSE) exec backend /bin/sh

.PHONY: shell-mongo
shell-mongo:
	$(DOCKER_COMPOSE) exec mongo mongosh -u root -p rootpassword --authenticationDatabase admin

.PHONY: migrate
migrate:
	$(DOCKER_COMPOSE) exec backend python manage.py migrate

.PHONY: seed
seed:
	$(DOCKER_COMPOSE) exec backend python manage.py seed_demo_data

.PHONY: test-backend
test-backend:
	$(DOCKER_COMPOSE) exec backend python manage.py test
