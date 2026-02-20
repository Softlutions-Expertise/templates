# Expense Tracker - Backend

API NestJS para controle de despesas.

## 🚀 Como rodar

```bash
# 1. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env se necessário

# 2. Subir containers (PostgreSQL + API)
docker-compose up -d

# 3. Executar migrations (primeira vez)
docker-compose exec api npm run migration:up

# Pronto! API em http://localhost:3001
# Documentação: http://localhost:3001/api/docs
```

## 🛠️ Desenvolvimento local (sem Docker)

```bash
# 1. Subir só o banco
docker-compose up -d postgres

# 2. Rodar API localmente
npm install
npm run migration:up
npm run start:dev
```

## 📝 Comandos

```bash
# Ver logs
docker-compose logs -f api

# Parar
docker-compose down

# Rebuildar
docker-compose up -d --build

# Migrations
docker-compose exec api npm run migration:up
docker-compose exec api npm run migration:create -- name=CreateXTable
```
