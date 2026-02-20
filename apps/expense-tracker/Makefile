# Expense Tracker - All Services

# Infrastructure
up:
	docker-compose up -d

up-build:
	docker-compose up -d --build

down:
	docker-compose down

down-volumes:
	docker-compose down -v

logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f api

logs-report:
	docker-compose logs -f report-service

# Individual Services
up-back:
	docker-compose up -d postgres redis minio api

up-report:
	docker-compose up -d report-service

# Development (local)
dev-back:
	cd back && npm run start:dev

dev-report:
	cd report-service && npm run start:dev

dev-front:
	cd front && npm run dev

# Install dependencies
install-back:
	cd back && npm install

install-report:
	cd report-service && npm install

install-front:
	cd front && npm install

install-all: install-back install-report install-front

# Build
build-back:
	cd back && npm run build

build-report:
	cd report-service && npm run build

build-all: build-back build-report
