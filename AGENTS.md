# AGENTS.md - Instruções para IAs

Este arquivo contém instruções CRÍTICAS para IAs trabalhando neste repositório.

## 🚨 Regras Absolutas

### 1. Isolamento de Apps

**NUNCA** crie arquivos de configuração na raiz do projeto (`package.json`, `docker-compose.yml`, `tsconfig.json`, etc.).

Cada app em `apps/` é um ambiente ISOLADO com sua própria configuração.

```
❌ ERRADO:
/package.json
/docker-compose.yml

✅ CERTO:
/apps/expense-tracker/back/package.json
/apps/expense-tracker/back/docker-compose.yml
/apps/expense-tracker/front/package.json
```

### 2. Templates são Reutilizáveis

Templates em `templates/` são pacotes INDEPENDENTES. Nunca modifique um template para atender a um app específico.

```
templates/
├── nest/          # Base NestJS - não modifique para casos específicos
├── next/          # Base Next.js - não modifique para casos específicos  
└── report/        # PDF + Bull + MinIO - mantenha genérico
```

Para usar um template em um app:
- Copie os arquivos base do template
- Adapte no app (nunca no template)
- Ou use como dependência local (file:../../../templates/report)

### 3. ValidationPipe CRÍTICO

**⚠️ NUNCA use `forbidNonWhitelisted: true` no ValidationPipe global!**

Isso quebra `nestjs-paginate` porque query params como `page`, `limit`, `sortBy` não estão nos DTOs.

```typescript
// ❌ QUEBRA A PAGINAÇÃO
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,  // REMOVA ISSO!
  transform: true,
}));

// ✅ FORMA CORRETA
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
}));
```

### 4. Paginação com nestjs-paginate

**SEMPRE** defina `filterableColumns`:

```typescript
return paginate(query, this.repository, {
  sortableColumns: ['date', 'amount'],
  searchableColumns: ['description'],
  filterableColumns: {        // ← OBRIGATÓRIO
    categoryId: true,
    status: [FilterOperator.EQ],
  },
  where: { userId },          // ← Isolamento por usuário
});
```

### 5. Docker - Nomes de Containers

Use nomes únicos por app para evitar conflitos:

```yaml
# docker-compose.yml
services:
  postgres:
    container_name: {app-name}-db      # ex: expense-tracker-db
  redis:
    container_name: {app-name}-redis   # ex: expense-tracker-redis
  minio:
    container_name: {app-name}-minio   # ex: expense-tracker-minio
  api:
    container_name: {app-name}-api     # ex: expense-tracker-api
```

### 6. Migrações TypeORM

Sempre use `tsconfig-paths/register` nas migrações se usar path aliases:

```json
// package.json
"migration:up": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d src/database/typeorm.config.ts"
```

## 🏗️ Arquitetura Padrão

### Backend NestJS (Monolito)

```
src/
├── apps/                    # Módulos de negócio
│   ├── auth/
│   ├── users/
│   └── expenses/
├── infrastructure/          # Configurações técnicas
│   └── authentication/     # JWT guards
├── database/
│   ├── migrations/
│   └── typeorm.config.ts
└── main.ts
```

### Report Service (Microserviço)

Quando necessário, extraia relatórios para um serviço separado:

```
apps/my-app/report-service/
├── src/
│   ├── reports/
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   ├── report.processor.ts    # Bull processor
│   │   ├── report-pdf.generator.ts
│   │   └── entities/
│   ├── storage/
│   │   └── minio.service.ts
│   └── main.ts
├── docker-compose.yml
└── package.json
```

Fluxo:
1. Report Service recebe POST → adiciona job à fila
2. Processor consome job → chama API Principal para dados
3. Gera PDF → upload MinIO
4. Retorna URL pré-assinada

## 📝 Convenções de Código

### Nomenclatura

- **Arquivos**: kebab-case.ts (ex: `report-processor.ts`)
- **Classes**: PascalCase (ex: `ReportProcessor`)
- **Interfaces**: PascalCase sem prefixo (ex: `ReportData`)
- **DTOs**: Sufixo Dto (ex: `CreateReportDto`)
- **Entities**: PascalCase, singular (ex: `Expense`)

### Imports

```typescript
// 1. NestJS/Core
import { Module } from '@nestjs/common';

// 2. Bibliotecas externas
import { Repository } from 'typeorm';
import { Queue } from 'bull';

// 3. Imports absolutos (@/)
import { Expense } from '@/apps/expenses/entities/expense.entity';

// 4. Imports relativos
import { ReportsService } from './reports.service';
```

### Tratamento de Erros

```typescript
// Use exceções HTTP do NestJS
import { NotFoundException, BadRequestException } from '@nestjs/common';

async findOne(id: string) {
  const entity = await this.repository.findOne({ where: { id } });
  if (!entity) {
    throw new NotFoundException('Entity not found');
  }
  return entity;
}
```

## 🧪 Comandos de Verificação

Antes de finalizar, execute:

```bash
# 1. Build
npm run build

# 2. Migrações
npm run migration:up

# 3. Docker
make up-build
make logs

# 4. Testar endpoints (em outro terminal)
curl http://localhost:3001/api/health
```

## 🔧 Solução de Problemas Comuns

### "container name already in use"

```bash
docker rm -f {container-name}
# ou
docker-compose down -v
```

### "property page should not exist" (ValidationPipe)

Remova `forbidNonWhitelisted: true` do ValidationPipe global.

### "Cannot find module '@/...'" em migrações

Use `ts-node -r tsconfig-paths/register` ou imports relativos nas migrations.

### Erro de Puppeteer no Docker

Adicione ao Dockerfile:
```dockerfile
# Dependências do Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    # ... (ver Dockerfile do expense-tracker)
```

## 📚 Referências Rápidas

- **PROJECT_STANDARD.md**: Padrões gerais do projeto
- **templates/report/README.md**: Documentação do template de relatórios
- **apps/expense-tracker/**: Exemplo completo de implementação

## ⚡ Decisões de Arquitetura

| Decisão | Motivação |
|---------|-----------|
| Apps isolados | Evita conflitos de dependências e configs |
| Templates separados | Reutilização sem acoplamento |
| Bull + Redis | Processamento assíncrono de relatórios |
| MinIO | Storage S3-compatible local/Docker |
| Puppeteer | PDF com CSS complexo e precisão |
| ValidationPipe sem forbidNonWhitelisted | Compatibilidade com nestjs-paginate |

## 🤖 Checklist para IAs

Ao criar/modificar código:

- [ ] Não criei arquivos na raiz do projeto
- [ ] Usei nomes únicos para containers Docker
- [ ] ValidationPipe sem `forbidNonWhitelisted: true`
- [ ] Paginação com `filterableColumns` definido
- [ ] Soft delete (`deletedAt`) nas entities
- [ ] Isolamento por usuário (`where: { userId }`)
- [ ] Migrações testadas com tsconfig-paths
- [ ] Build passando sem erros
- [ ] Report Service separado do Backend (quando aplicável)

---

Última atualização: 2026-02-17
