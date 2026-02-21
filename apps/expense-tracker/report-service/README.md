# Expense Tracker - Report Service

Microserviço de geração de relatórios do Expense Tracker.

## Arquitetura

Este serviço segue o padrão do `not-clean/report`, utilizando:
- **React JSX** para templates de relatórios
- **ReactDOMServer** para renderização SSR
- **Cheerio** para manipulação do HTML

## Estrutura

```
src/
├── api/                    # API Express
│   └── app/
│       └── modules/
│           └── generate-report/
├── reports/
│   ├── core/              # Core do sistema de relatórios
│   │   ├── jsx/          # Renderização JSX
│   │   └── base-report-module.ts
│   └── templates/        # Templates de relatórios
│       ├── components/   # Componentes genéricos reutilizáveis
│       └── modules/      # Módulos específicos de relatório
│           └── auditoria/
└── utils/               # Utilitários
```

## Componentes Genéricos

- **JsxReportLayout** - Layout base do relatório
- **JsxReportBrandHeader** - Cabeçalho com logo
- **JsxReportHeaderFilters** - Lista de filtros aplicados
- **JsxReportAutoTable** - Tabela genérica com colunas configuráveis
- **JsxReportSectionTitle** - Título do relatório

## Módulos de Relatório

### Auditoria

Gera relatório de auditoria com as ações realizadas no sistema.

**Endpoint:** `POST /generate/auditoria`

**Body:**
```json
{
  "filters": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "acao": "create",
    "entidade": "expense"
  },
  "rows": [...],
  "totalRecords": 100
}
```

## Como criar um novo relatório

1. Criar pasta em `src/reports/templates/modules/{nome-do-relatorio}/`
2. Criar arquivo de tipos `{nome}-report.types.ts`
3. Criar template JSX `jsx-report-{nome}.tsx`
4. Criar módulo `{nome}-report-module.ts` extendendo `BaseReportModule`
5. Registrar no `reports-manager.ts`
6. Criar endpoint em `src/api/app/modules/generate-report/`

## Comandos

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start
```

## Porta

O serviço roda na porta **3002** por padrão.
