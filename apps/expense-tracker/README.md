# Expense Tracker

Sistema completo de gestão de despesas pessoais com relatórios avançados.

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        DOCKER COMPOSE                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)    →  http://localhost:8085             │
│  Backend API (NestJS)  →  http://localhost:3001/api/v1      │
│  Report Service        →  http://localhost:3002             │
│  PostgreSQL            →  localhost:5432                    │
│  Redis                 →  localhost:6379                    │
│  MinIO                 →  http://localhost:9001             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Início Rápido

### Subir TUDO com um comando:

```bash
cd apps/expense-tracker
make up
```

Isso irá:
1. Buildar todas as imagens Docker
2. Subir PostgreSQL, Redis, MinIO
3. Subir Report Service
4. Subir Backend API
5. Subir Frontend

Aguarde ~30-60 segundos para todos os serviços inicializarem.

### Verificar se está tudo funcionando:

```bash
make health
```

### Acessar a aplicação:

- **Frontend:** http://localhost:8085
- **API:** http://localhost:3001/api/v1
- **Swagger:** http://localhost:3001/api/docs
- **MinIO Console:** http://localhost:9001 (minioadmin/minioadmin)

### Parar tudo:

```bash
make down
```

### Limpar tudo (remove volumes):

```bash
make clean
```

## 📋 Comandos Disponíveis

### Docker (Produção)

| Comando | Descrição |
|---------|-----------|
| `make up` | Sobe todos os serviços |
| `make down` | Para todos os serviços |
| `make clean` | Para e remove volumes |
| `make logs` | Mostra logs de todos os serviços |
| `make logs-back` | Logs do backend |
| `make logs-report` | Logs do report service |
| `make ps` | Status dos containers |
| `make health` | Verifica saúde dos serviços |

### Desenvolvimento Local

| Comando | Descrição |
|---------|-----------|
| `make install` | Instala dependências de todos os projetos |
| `make build` | Build de todos os projetos |
| `make dev-infra` | Só infraestrutura (DB, Redis, MinIO) |
| `make dev-back` | Backend em modo desenvolvimento |
| `make dev-report` | Report Service em modo desenvolvimento |
| `make dev-front` | Frontend em modo desenvolvimento |

## 🐳 Serviços

### Backend API (Porta 3001)
- NestJS
- PostgreSQL
- Redis (filas)
- MinIO (storage)

### Report Service (Porta 3002)
- Express + React JSX SSR
- Geração de relatórios PDF/HTML
- Independente do backend

### Frontend (Porta 8085)
- Next.js
- Material UI
- Responsivo

## 📊 Relatórios

O sistema possui 2 tipos de relatórios:

1. **Relatório de Despesas** - Gerado pelo backend com Puppeteer
2. **Relatório de Auditoria** - Gerado pelo Report Service com React JSX

### Fluxo do Relatório de Auditoria:
```
Frontend → Backend → Report Service → HTML → Frontend
```

## 🛠️ Desenvolvimento

Para desenvolver localmente sem Docker:

```bash
# Terminal 1 - Infraestrutura
make dev-infra

# Terminal 2 - Report Service
cd report-service && npm run dev

# Terminal 3 - Backend
cd back && npm run start:dev

# Terminal 4 - Frontend
cd front && npm run dev
```

## 🔧 Configurações

As configurações estão no `docker-compose.yml`:

- **Banco de dados:** PostgreSQL (expense_tracker)
- **Redis:** Porta 6379
- **MinIO:** Portas 9000 (API) e 9001 (Console)
- **Report Service:** URL interna `http://report-service:3002`

## 📝 Licença

MIT
