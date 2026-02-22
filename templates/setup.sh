#!/bin/bash

# Script de setup rápido para desenvolvimento
# Uso: ./setup.sh

set -e

echo "🚀 Setup do ambiente de desenvolvimento"
echo "========================================"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Docker
echo -e "${BLUE}Verificando Docker...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi
echo -e "${GREEN}✓ Docker OK${NC}"

# Subir containers
echo ""
echo -e "${BLUE}Subindo containers...${NC}"
docker-compose -f docker-compose.dev.yml up -d
echo -e "${GREEN}✓ Containers rodando${NC}"

# Aguardar PostgreSQL estar pronto
echo ""
echo -e "${BLUE}Aguardando PostgreSQL...${NC}"
until docker exec template-postgres pg_isready -U postgres > /dev/null 2>&1; do
    sleep 1
done
echo -e "${GREEN}✓ PostgreSQL pronto${NC}"

# Backend setup
echo ""
echo -e "${BLUE}Setup do Backend...${NC}"
cd back-end/nest

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠ Arquivo .env criado. Edite conforme necessário.${NC}"
fi

echo "Instalando dependências..."
npm install

echo "Rodando migrações..."
npm run migration:up

echo -e "${GREEN}✓ Backend pronto${NC}"

# Frontend setup
echo ""
echo -e "${BLUE}Setup do Frontend...${NC}"
cd ../../front-end/next

if [ ! -f ".env.local" ]; then
    cp .env.local.example .env.local
    echo -e "${YELLOW}⚠ Arquivo .env.local criado. Edite conforme necessário.${NC}"
fi

echo "Instalando dependências..."
npm install

echo -e "${GREEN}✓ Frontend pronto${NC}"

cd ../..

# Resumo
echo ""
echo "========================================"
echo -e "${GREEN}✅ Setup completo!${NC}"
echo ""
echo "Para iniciar o desenvolvimento:"
echo ""
echo "1. Terminal 1 - Backend:"
echo "   cd back-end/nest && npm run start:dev"
echo ""
echo "2. Terminal 2 - Frontend:"
echo "   cd front-end/next && npm run dev"
echo ""
echo "Acesse:"
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:3000"
echo "   Swagger:  http://localhost:3000/api/docs"
echo "   MinIO:    http://localhost:9003 (minioadmin/minioadmin)"
echo ""
echo "Login padrão:"
echo "   Usuário: admin"
echo "   Senha:   admin123"
echo ""
echo "Comandos úteis:"
echo "   make up     - Sobe containers"
echo "   make down   - Derruba containers"
echo "   make psql   - Acessa PostgreSQL"
echo "   make logs   - Ver logs"
echo ""
