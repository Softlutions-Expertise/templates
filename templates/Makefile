# Makefile para desenvolvimento local

.PHONY: help up down logs psql redis-cli minio-cli

help: ## Mostra esta ajuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

up: ## Sobe os containers (postgres, redis, minio)
	docker-compose -f docker-compose.dev.yml up -d

down: ## Derruba os containers
	docker-compose -f docker-compose.dev.yml down

down-v: ## Derruba os containers e remove volumes (CUIDADO: apaga dados!)
	docker-compose -f docker-compose.dev.yml down -v

logs: ## Mostra logs dos containers
	docker-compose -f docker-compose.dev.yml logs -f

psql: ## Acessa o PostgreSQL via psql
	docker exec -it template-postgres psql -U postgres -d template_db

redis-cli: ## Acessa o Redis via redis-cli
	docker exec -it template-redis redis-cli

minio-cli: ## Mostra comando para configurar MinIO
	@echo "MinIO Console: http://localhost:9003"
	@echo "Access Key: minioadmin"
	@echo "Secret Key: minioadmin"
	@echo "API Endpoint: http://localhost:9002"

status: ## Mostra status dos containers
	docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep template
