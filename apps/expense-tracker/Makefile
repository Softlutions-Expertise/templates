# Expense Tracker - Makefile
# Comandos para desenvolvimento e produção

.PHONY: help install dev dev-back dev-report build up down logs ps health

# ============================================================================
# COMANDOS DOCKER (TUDO EM UM)
# ============================================================================

# Sobe TUDO em containers (PostgreSQL, Redis, Report Service, Backend, Frontend)
up:
	@echo "🚀 Subindo todos os serviços..."
	docker-compose up --build -d
	@echo ""
	@echo "✅ Serviços disponíveis:"
	@echo "   Frontend:    http://localhost:8085"
	@echo "   Backend API: http://localhost:3001/api/v1"
	@echo "   Report Svc:  http://localhost:3002"
	@echo "   MinIO:       http://localhost:9001 (minioadmin/minioadmin)"
	@echo ""
	@sleep 3
	@make health

# Para todos os serviços
down:
	@echo "🛑 Parando todos os serviços..."
	docker-compose down

# Para e remove volumes (limpa tudo)
clean:
	@echo "🧹 Limpando containers e volumes..."
	docker-compose down -v
	docker system prune -f

# Mostra logs de todos os serviços
logs:
	docker-compose logs -f

# Mostra logs de um serviço específico
logs-back:
	docker-compose logs -f backend

logs-report:
	docker-compose logs -f report-service

logs-db:
	docker-compose logs -f postgres

# Status dos containers
ps:
	docker-compose ps

# Verifica saúde dos serviços
health:
	@echo ""
	@echo "🏥 Verificando saúde dos serviços..."
	@echo ""
	@echo -n "PostgreSQL:  "
	@docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1 && echo "✅ OK" || echo "❌ Falha"
	@echo -n "Redis:       "
	@docker-compose exec -T redis redis-cli ping >/dev/null 2>&1 && echo "✅ OK" || echo "❌ Falha"
	@echo -n "Report Svc:  "
	@curl -s http://localhost:3002/health >/dev/null 2>&1 && echo "✅ OK" || echo "❌ Falha"
	@echo -n "Backend:     "
	@curl -s http://localhost:3001/api/v1/health >/dev/null 2>&1 && echo "✅ OK" || echo "❌ Falha"
	@echo -n "Frontend:    "
	@curl -s http://localhost:8085 >/dev/null 2>&1 && echo "✅ OK" || echo "❌ Falha"
	@echo ""

# ============================================================================
# COMANDOS DE DESENVOLVIMENTO (SEM DOCKER)
# ============================================================================

# Instala dependências de todos os projetos
install:
	@echo "📦 Instalando dependências..."
	@echo ""
	@echo "→ Backend..."
	cd back && npm install
	@echo ""
	@echo "→ Report Service..."
	cd report-service && npm install
	@echo ""
	@echo "→ Frontend..."
	cd front && npm install
	@echo ""
	@echo "✅ Instalação completa!"

# Build em todos os projetos
build:
	@echo "🔨 Fazendo build..."
	@echo ""
	@echo "→ Report Service..."
	cd report-service && npm run build
	@echo ""
	@echo "→ Backend..."
	cd back && npm run build
	@echo ""
	@echo "→ Frontend..."
	cd front && npm run build
	@echo ""
	@echo "✅ Build completo!"

# ============================================================================
# COMANDOS DE DESENVOLVIMENTO INDIVIDUAIS
# ============================================================================

# Desenvolvimento - apenas infraestrutura (DB, Redis, MinIO)
dev-infra:
	@echo "🐳 Subindo infraestrutura (PostgreSQL, Redis, MinIO)..."
	docker-compose up -d postgres redis minio
	@echo "Aguardando serviços ficarem prontos..."
	@sleep 5
	@echo ""
	@echo "✅ Infraestrutura pronta!"
	@echo "   PostgreSQL: localhost:5432"
	@echo "   Redis:      localhost:6379"
	@echo "   MinIO:      localhost:9000"

# Desenvolvimento - Report Service apenas
dev-report:
	cd report-service && npm run dev

# Desenvolvimento - Backend apenas
dev-back:
	cd back && npm run start:dev

# Desenvolvimento - Frontend apenas  
dev-front:
	cd front && npm run dev

# ============================================================================
# UTILITÁRIOS
# ============================================================================

# Help
help:
	@echo "================================================================"
	@echo "  EXPENSE TRACKER - COMANDOS DISPONÍVEIS"
	@echo "================================================================"
	@echo ""
	@echo "🐳 DOCKER (TUDO EM UM):"
	@echo "  make up           - Sobe TUDO (DB, Redis, Report, Backend, Front)"
	@echo "  make down         - Para todos os serviços"
	@echo "  make clean        - Para e remove volumes (limpa tudo)"
	@echo "  make logs         - Mostra logs de todos os serviços"
	@echo "  make ps           - Mostra status dos containers"
	@echo "  make health       - Verifica saúde dos serviços"
	@echo ""
	@echo "🐳 LOGS ESPECÍFICOS:"
	@echo "  make logs-back    - Logs do backend"
	@echo "  make logs-report  - Logs do report service"
	@echo "  make logs-db      - Logs do PostgreSQL"
	@echo ""
	@echo "💻 DESENVOLVIMENTO LOCAL:"
	@echo "  make install      - Instala dependências de todos os projetos"
	@echo "  make build        - Faz build de todos os projetos"
	@echo "  make dev-infra    - Sobe só infraestrutura (DB, Redis, MinIO)"
	@echo "  make dev-report   - Report Service (npm run dev)"
	@echo "  make dev-back     - Backend (npm run start:dev)"
	@echo "  make dev-front    - Frontend (npm run dev)"
	@echo ""
	@echo "================================================================"

# Default
.DEFAULT_GOAL := help
