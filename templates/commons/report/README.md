# Report Template

Template reutilizável para geração de relatórios PDF com fila de processamento (Bull) e armazenamento em objeto (MinIO).

## Stack

- **TypeScript** - Linguagem principal
- **Puppeteer** - Geração de PDF a partir de HTML
- **Bull** - Fila de processamento assíncrono (Redis)
- **MinIO** - Storage de objetos compatível com S3
- **date-fns** - Formatação de datas

## Estrutura

```
src/
├── reports/
│   ├── report-generator.ts    # Geração de PDF com Puppeteer
│   └── report-template.ts     # Templates HTML/CSS
├── queue/
│   └── report-queue.ts        # Configuração Bull + Redis
├── storage/
│   └── minio-storage.ts       # Client MinIO para upload
├── types/
│   └── index.ts               # Exportações de tipos
└── index.ts                   # Entry point
```

## Uso

### 1. Instalação

```bash
npm install
npm run build
```

### 2. Geração de PDF

```typescript
import { generateExpenseReport, ExpenseReportData } from '@softlutions/report-template';

const data: ExpenseReportData = {
  title: 'Relatório de Despesas',
  generatedAt: new Date().toISOString(),
  filters: { startDate: '2024-01-01', endDate: '2024-12-31' },
  summary: {
    total: 5000.00,
    count: 25,
    average: 200.00,
    byCategory: [{ name: 'Alimentação', value: 2000.00 }]
  },
  expenses: [
    { id: '1', date: '2024-01-15', amount: 100.00, description: 'Supermercado', category: 'Alimentação' }
  ]
};

const pdfBuffer = await generateExpenseReport(data);
```

### 3. Fila Bull

```typescript
import { createReportQueue, addToQueue } from '@softlutions/report-template';

const queue = createReportQueue('redis://localhost:6379');
await addToQueue(queue, { reportId: '123', userId: '456' });
```

### 4. Storage MinIO

```typescript
import { createMinioClient, uploadPdf } from '@softlutions/report-template';

const client = createMinioClient({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
});

await uploadPdf(client, pdfBuffer, 'report-123.pdf', 'reports');
```

## Variáveis de Ambiente

```bash
# Redis (Bull)
REDIS_HOST=localhost
REDIS_PORT=6379

# MinIO
MINIO_HOST=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=reports
MINIO_USE_SSL=false
```

## Integração com NestJS

Ver exemplo em `apps/expense-tracker/back/src/apps/reports/`

```typescript
// reports.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'reports' }),
  ],
  providers: [ReportsService, ReportProcessor],
})
export class ReportsModule {}
```

## Licença

MIT
