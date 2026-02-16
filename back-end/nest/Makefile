.PHONY: up down logs shell migrate

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f api

shell:
	docker-compose exec api sh

migrate:
	docker-compose exec api npm run migration:up

migrate-create:
	docker-compose exec api npm run migration:create src/database/migrations/$(name)

migrate-generate:
	docker-compose exec api npm run migration:generate src/database/migrations/$(name)
