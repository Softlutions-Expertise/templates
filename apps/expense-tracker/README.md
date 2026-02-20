# Expense Tracker

Aplicação completa de controle de despesas com arquitetura de microserviços.

## Arquitetura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │◀────│  Report Service │
│  (Next.js)      │     │   (NestJS)      │     │  (NestJS+Bull)  │
│   :8085         │     │    :3001        │     │    :3002        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │                         │
                               ▼                         ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │   PostgreSQL    │     │      MinIO      │
                        │     :5432       │     │  :9000/:9001    │
                        └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │     Redis       │
                        │     :6379       │
                        └─────────────────┘
```

### Serviços

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Frontend | 8085 | Next.js + Material-UI |
| Backend API | 3001 | NestJS - Auth, Expenses, Categories, Dashboard |
| Report Service | 3002 | NestJS - Geração async de PDFs |
| PostgreSQL | 5432 | Banco de dados |
| Redis | 6379 | Fila Bull |
| MinIO | 9000/9001 | Storage de PDFs |

## Estrutura

```
apps/expense-tracker/
├── back/                    # Backend API (Core)
│   ├── src/apps/
│   │   ├── auth/
│   │   ├── expenses/
│   │   ├── categories/
│   │   └── dashboard/
│   ├── docker-compose.yml
│   └── package.json
├── report-service/          # Microserviço de Relatórios
│   ├── src/reports/
│   ├── docker-compose.yml
│   └── package.json
├── front/                   # Frontend Next.js
│   └── package.json
├── docker-compose.yml       # Orquestra todos os serviços
├── Makefile
└── README.md
```

## Fluxo de Geração de Relatórios

1. Frontend chama `POST /reports` no **Report Service**
2. Report Service adiciona job na fila **Bull+Redis**
3. Processor busca dados na **Backend API**
4. Gera PDF com **Puppeteer**
5. Faz upload para **MinIO**
6. Retorna URL pré-assinada (24h)

## Quick Start

### 1. Configurar variáveis

```bash
cp .env.example .env
# Edite .env se necessário
```

### 2. Iniciar todos os serviços

```bash
make up-build
```

### 3. Acessar

- Frontend: http://localhost:8085
- API Docs: http://localhost:3001/api/docs
- MinIO Console: http://localhost:9001 (minioadmin/minioadmin)

### 4. Comandos úteis

```bash
# Logs
make logs-api        # API
make logs-report     # Report Service

# Desenvolvimento local
make dev-back        # Backend
make dev-report      # Report Service
make dev-front       # Frontend

# Parar tudo
make down
```

## Desenvolvimento Individual

### Backend API

```bash
cd back
cp .env.example .env
npm install
npm run start:dev
```

### Report Service

```bash
cd report-service
cp .env.example .env
npm install
npm run start:dev
```

### Frontend

```bash
cd front
npm install
npm run dev
```

## API Endpoints

### Backend (`:3001`)
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/expenses` (paginado)
- `GET /api/categories`
- `GET /api/dashboard/summary`

### Report Service (`:3002`)
- `POST /reports` - Criar relatório
- `GET /reports` - Listar relatórios
- `GET /reports/:id` - Status do relatório
- `GET /reports/:id/download` - Download PDF

## Tecnologias

- **Backend**: NestJS, TypeORM, PostgreSQL
- **Report**: NestJS, Bull, Puppeteer, MinIO
- **Frontend**: Next.js, Material-UI, Recharts
- **Infra**: Docker, Redis, MinIO

## Templates Usados

Este app demonstra o uso dos templates em `templates/`:
- `templates/nest/` - Base do backend
- `templates/report/` - Conceitos de PDF + Bull + MinIO

> **Nota**: Os templates são apenas referência. Cada app tem sua própria implementação independente.
