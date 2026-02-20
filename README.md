# Softlutions Templates

Repositório de templates reutilizáveis e aplicações de exemplo para desenvolvimento web.

## 📁 Estrutura

```
.
├── AGENTS.md              # ⚠️ INSTRUÇÕES CRÍTICAS para IAs
├── PROJECT_STANDARD.md    # Padrões e convenções do projeto
├── templates/             # Templates base reutilizáveis
│   ├── nest/             # Template NestJS + TypeORM
│   ├── next/             # Template Next.js + MUI
│   └── report/           # Template PDF + Bull + MinIO
└── apps/                 # Aplicações completas
    └── expense-tracker/  # App exemplo usando os templates
        ├── back/         # Backend NestJS
        └── front/        # Frontend Next.js
```

## 🚀 Templates Disponíveis

### `@softlutions/report-template`

Template para geração de relatórios PDF com fila de processamento.

**Stack:**
- Puppeteer (PDF)
- Bull + Redis (Fila)
- MinIO (Storage)
- date-fns (Datas)

**Uso:**
```bash
cd templates/report
npm install
npm run build
```

Veja [templates/report/README.md](templates/report/README.md) para detalhes.

## 🛠️ Apps

### Expense Tracker

Aplicação completa de controle de despesas demonstrando:
- Autenticação JWT
- CRUD com paginação (nestjs-paginate)
- Relatórios PDF async (Bull + MinIO)
- Docker multi-container

**Backend:**
```bash
cd apps/expense-tracker/back
cp .env.example .env
make up-build
```

**Frontend:**
```bash
cd apps/expense-tracker/front
npm install
npm run dev
```

## 📋 Convenções Importantes

1. **Apps são isolados** - Cada app tem seu próprio `package.json`, `docker-compose.yml`, etc.
2. **Templates são independentes** - Nunca modifique um template para um caso específico
3. **ValidationPipe** - NUNCA use `forbidNonWhitelisted: true` (quebra paginação)
4. **Docker** - Use nomes únicos de containers por app

## 📚 Documentação

- **[AGENTS.md](AGENTS.md)** - Instruções obrigatórias para IAs
- **[PROJECT_STANDARD.md](PROJECT_STANDARD.md)** - Padrões de código e arquitetura
- **[templates/report/README.md](templates/report/README.md)** - Doc do template de relatórios

## 🏗️ Stack Padrão

### Backend
- NestJS 10.x
- PostgreSQL 15 + TypeORM
- Redis 7 + Bull
- MinIO
- Puppeteer

### Frontend
- Next.js 14+
- Material-UI v5/v6
- Axios
- Recharts

## 📝 Licença

MIT - Livre para uso e modificação.
