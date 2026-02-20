# Project Standards

Este documento define os padrões e convenções para todos os projetos do repositório.

## Estrutura de Repositórios

```
templates/
├── nest/                  # Template base NestJS
├── next/                  # Template base Next.js
└── report/                # Template de relatórios (PDF + Bull + MinIO)

apps/
├── expense-tracker/       # Aplicação completa exemplo
│   ├── back/             # Backend NestJS (Core)
│   ├── report-service/   # Microserviço de relatórios
│   └── front/            # Frontend Next.js
```

### Regras de Organização

1. **Templates são independentes** - Cada template em `templates/` é um pacote reutilizável
2. **Apps são isolados** - Cada app em `apps/` tem seu próprio ambiente (Docker, deps, config)
3. **Não compartilhar configs na raiz** - Cada serviço tem sua própria configuração
4. **Serviços são separados** - Um app pode ter múltiplos serviços (back, report-service, etc.)

## Stack Padrão

### Backend (NestJS)

- **Framework**: NestJS 10.x
- **DB**: PostgreSQL 15 + TypeORM 0.3.x
- **Cache/Fila**: Redis 7 + Bull 4.x
- **Storage**: MinIO (S3-compatible)
- **PDF**: Puppeteer 24.x
- **Validação**: class-validator + class-transformer
- **Paginação**: nestjs-paginate 9.x
- **Auth**: JWT (@nestjs/jwt + passport-jwt)

### Frontend (Next.js)

- **Framework**: Next.js 14+ (App Router)
- **UI**: Material-UI (MUI) v5/v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Datas**: date-fns
- **Estado**: React Context (para apps simples) ou Zustand

## Convenções de Código

### TypeScript

```typescript
// Use interfaces para contratos públicos
export interface CreateUserDto {
  email: string;
  password: string;
}

// Use types para uniões/aliases
type ReportStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Prefixo I apenas para interfaces de infraestrutura
interface IJwtPayload { }
```

### NestJS

```typescript
// Estrutura de módulos: src/apps/[feature]/
src/apps/reports/
├── reports.module.ts
├── reports.controller.ts
├── reports.service.ts
├── report.processor.ts      // Bull processor
├── dto/
│   ├── create-report.dto.ts
│   └── report-query.dto.ts
└── entities/
    └── report.entity.ts

// Separe infraestrutura
src/infrastructure/
├── queue/                   // Config Bull
├── storage/                 // Config MinIO
└── authentication/          // Guards JWT
```

### Banco de Dados (TypeORM)

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;  // Soft delete obrigatório
}
```

### Validação CRÍTICA

**⚠️ NUNCA use `forbidNonWhitelisted: true` no ValidationPipe global!**

```typescript
// ❌ ERRADO - Quebra nestjs-paginate
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,  // REMOVER!
  transform: true,
}));

// ✅ CERTO
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
}));
```

### Docker

```yaml
# docker-compose.yml por serviço
# NUNCA na raiz do projeto

version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: {app-name}-db
    
  redis:
    image: redis:7-alpine
    container_name: {app-name}-redis
    
  minio:
    image: minio/minio:latest
    container_name: {app-name}-minio
    
  api:
    build: .
    container_name: {app-name}-api
    depends_on:
      - postgres
      - redis
      - minio
```

### Paginação (nestjs-paginate)

```typescript
// SEMPRE defina filterableColumns
async findAll(query: PaginateQuery, userId: string) {
  return paginate(query, this.repository, {
    sortableColumns: ['createdAt', 'name'],
    searchableColumns: ['name', 'description'],
    filterableColumns: {
      status: [FilterOperator.EQ],
      categoryId: true,  // Operadores padrão
    },
    where: { userId, deletedAt: null },  // Isolamento
    relations: ['category'],
  });
}
```

## Arquitetura de Microserviços

### Exemplo: Expense Tracker

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │◀────│  Report Service │
│   (Next.js)     │     │   (NestJS)      │     │ (NestJS + Bull) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │                         │
                               ▼                         ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │   PostgreSQL    │     │      MinIO      │
                        └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │     Redis       │
                        └─────────────────┘
```

### Estrutura de um App com Múltiplos Serviços

```
apps/my-app/
├── back/                   # API Principal
│   ├── src/
│   ├── docker-compose.yml
│   └── package.json
├── report-service/         # Microserviço (opcional)
│   ├── src/
│   ├── docker-compose.yml
│   └── package.json
├── front/                  # Frontend
│   └── package.json
├── docker-compose.yml      # Orquestra todos
└── Makefile
```

### Comunicação entre Serviços

- **HTTP/REST**: Para chamadas síncronas
- **Bull + Redis**: Para processamento assíncrono
- **Banco Compartilhado**: PostgreSQL (mesma instância, schemas separados se necessário)
- **Storage Compartilhado**: MinIO

### Fluxo de Relatórios (Async)

```
POST /reports (Report Service)
  ↓
Bull Queue (Redis)
  ↓
ReportProcessor (chama API Principal para dados)
  ↓
Generate HTML → Puppeteer → PDF
  ↓
MinIO Upload
  ↓
Presigned URL (24h)
```

### Implementação

```typescript
// report-service/src/reports/report.processor.ts
@Processor('reports')
export class ReportProcessor {
  @Process('generate-report')
  async handle(job: Job<ReportJobData>) {
    // 1. Busca dados da API principal
    const expenses = await fetch(`${API_URL}/expenses`, ...);
    
    // 2. Gera PDF
    const pdf = await this.pdfGenerator.generate(expenses);
    
    // 3. Upload MinIO
    const url = await this.minio.upload(pdf);
    
    return { url };
  }
}
```

## Ambiente de Desenvolvimento

### Comandos Makefile Padrão

```makefile
# Backends NestJS
up:           # docker-compose up -d
up-build:     # docker-compose up -d --build
down:         # docker-compose down
logs:         # docker-compose logs -f api

# Migrações TypeORM
migration:up:     # ts-node typeorm migration:run
migration:down:   # ts-node typeorm migration:revert
migration:gen:    # typeorm migration:generate

# Frontends Next.js
dev:          # npm run dev
build:        # npm run build
start:        # npm start
```

### Portas Padrão

| Serviço    | Porta | Container Name Pattern  |
|------------|-------|-------------------------|
| PostgreSQL | 5432  | {app-name}-db           |
| Redis      | 6379  | {app-name}-redis        |
| MinIO API  | 9000  | {app-name}-minio        |
| MinIO UI   | 9001  | {app-name}-minio        |
| NestJS API | 3001  | {app-name}-api          |
| Next.js    | 3000  | {app-name}-web          |

## Checklist de Novo App

- [ ] Copiar template base (nest/next)
- [ ] Configurar docker-compose.yml com nomes únicos
- [ ] Criar .env.example completo
- [ ] Criar Makefile com comandos padrão
- [ ] Configurar TypeORM + migrations
- [ ] ValidationPipe SEM `forbidNonWhitelisted`
- [ ] Configurar nestjs-paginate com filterableColumns
- [ ] JWT Auth configurado
- [ ] Módulo de relatórios (se necessário) integrando template

## Versionamento

- **Node**: 20.x LTS
- **PostgreSQL**: 15.x
- **Redis**: 7.x
- **MinIO**: Latest

## Contato

Para dúvidas sobre padrões, consulte o AGENTS.md
