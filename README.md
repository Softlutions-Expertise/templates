# Softlutions Templates

> Repositório de templates padronizados para desenvolvimento de aplicações web

Este repositório contém templates estruturados e documentados para acelerar o desenvolvimento de projetos, seguindo as melhores práticas e padrões de arquitetura.

---

## 📦 Templates Disponíveis

### Frontend

| Template | Tecnologias | Descrição | Documentação |
|----------|-------------|-----------|--------------|
| [Next.js](./front-end/next) | Next.js 13+, TypeScript, Material-UI | Template completo para SPAs com App Router, autenticação JWT e CRUD | [📖 Standard](./front-end/next/PROJECT_STANDARD.md) · [🤖 Agents](./front-end/next/AGENTS.md) |

### Backend

| Template | Tecnologias | Descrição | Documentação |
|----------|-------------|-----------|--------------|
| [NestJS](./back-end/nest) | NestJS 10+, TypeScript, TypeORM, PostgreSQL | API REST com autenticação JWT, autorização e CRUD completo | [📖 Standard](./back-end/nest/PROJECT_STANDARD.md) · [🤖 Agents](./back-end/nest/AGENTS.md) |

---

## 🥞 Stacks Combinadas

Templates pré-configurados para trabalharem juntos:

| Stack | Frontend | Backend | Documentação |
|-------|----------|---------|--------------|
| Next.js + NestJS | Next.js 13+ | NestJS 10+ | [📖 Ver Stack](./stacks/nextjs-nestjs/) |

---

## 🚀 Começando

Escolha o template ou stack que melhor se adapta ao seu projeto:

### Usar apenas Frontend
```bash
cd front-end/next
npm install
cp .env.example .env
npm run dev
```

### Usar apenas Backend
```bash
cd back-end/nest
npm install
cp .env.example .env
make up
make migrate
```

### Usar Stack Completa (Front + Back)
Consulte a documentação específica da stack:
- [Next.js + NestJS](./stacks/nextjs-nestjs/)

---

## 📁 Estrutura do Repositório

```
.
├── front-end/          # Templates de frontend
│   └── next/          # Next.js Template
│       ├── README.md
│       ├── PROJECT_STANDARD.md
│       ├── AGENTS.md
│       └── src/
│
├── back-end/           # Templates de backend
│   └── nest/          # NestJS Template
│       ├── README.md
│       ├── PROJECT_STANDARD.md
│       ├── AGENTS.md
│       └── src/
│
├── stacks/             # Combinações de templates (Fullstack)
│   └── nextjs-nestjs/ # Stack Next.js + NestJS
│       └── README.md
│
└── README.md          # Este arquivo
```

---

## 🎯 Estrutura de Cada Template

Cada template contém:

| Arquivo | Propósito |
|---------|-----------|
| `README.md` | Guia rápido de instalação e uso |
| `PROJECT_STANDARD.md` | Arquitetura completa, padrões de código, exemplos |
| `AGENTS.md` | Guia específico para assistentes de IA |

---

## 📝 Convenções Gerais

Todos os templates seguem estas convenções:

### Separador de Código
```typescript
// ----------------------------------------------------------------------
```

### Naming Conventions
| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes/Classes | PascalCase | `UserCard`, `AuthService` |
| Interfaces | PascalCase + I | `IUser`, `IAuthPayload` |
| Funções/Métodos | camelCase | `findAll`, `handleSubmit` |
| Constantes | UPPER_SNAKE_CASE | `API_URL`, `JWT_SECRET` |

---

## 🤝 Contribuição

Para sugerir melhorias ou reportar problemas:

1. Certifique-se de seguir os padrões estabelecidos nos `PROJECT_STANDARD.md`
2. Atualize a documentação quando necessário
3. Mantenha os templates funcionais e testados

---

## 📄 Licença

Os templates deste repositório estão sob licença MIT.

---
