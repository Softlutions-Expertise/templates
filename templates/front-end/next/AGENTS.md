# AGENTS.md - Next.js Template

> **Template:** Next.js 13+ (App Router) + TypeScript + Material-UI v5  
> **Arquitetura:** Feature-based, Layered Architecture

---

## 🚨 REGRAS CRÍTICAS - CRIAÇÃO DE NOVOS PROJETOS

### 1. SEMPRE Copiar Configurações do Template Base

**❌ NUNCA crie arquivos de configuração do zero (package.json, tsconfig.json, next.config.js, etc)**

**✅ SEMPRE copie do template base e adapte:**

```bash
# Estrutura obrigatória - copiar do template
front-end/next/
├── package.json              # Copiar e alterar apenas "name" e "description"
├── tsconfig.json             # Copiar sem alterações
├── next.config.js            # Copiar sem alterações
├── .eslintrc.json            # Copiar sem alterações
├── prettier.config.js        # Copiar sem alterações
├── .env.example              # Copiar e ajustar URLs da API
└── Dockerfile                # Copiar sem alterações (se existir)
```

### 2. Containerização (Quando aplicável)

**Para projetos fullstack ou com necessidade de container:**

- ✅ `Dockerfile` para build de produção
- ✅ `docker-compose.yml` se precisar de serviços adicionais
- ✅ `.env.example` com todas as variáveis documentadas

**Exemplo de Dockerfile:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 8084
CMD ["npm", "start"]
```

### 3. Arquivo .env Obrigatório

**Todo projeto deve ter:**
- `.env.example` versionado (com valores placeholder)
- `.env` no .gitignore
- Variáveis de API configuradas:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### 4. Checklist de Setup Inicial

Ao criar novo projeto:

- [ ] Copiar arquivos de config do template base
- [ ] Ajustar `name` no package.json
- [ ] Criar `.env.example` com todas as variáveis necessárias
- [ ] Criar `.env` local (não versionar)
- [ ] Verificar se Dockerfile existe (se necessário)
- [ ] Documentar como rodar o projeto no README.md

---

## 📁 Estrutura de Diretórios

```
src/
├── app/                     # Next.js App Router
│   ├── auth/               # Rotas públicas (login, forgot-password)
│   ├── dashboard/          # Área logada
│   │   ├── layout.tsx      # AuthGuard + DashboardLayout
│   │   ├── page.tsx        # Home do dashboard
│   │   └── [modulo]/       # Módulos (ex: example/)
│   │       └── [entidade]/
│   │           ├── list/page.tsx
│   │           ├── create/page.tsx
│   │           └── [id]/edit/page.tsx
│   ├── layout.tsx          # Root layout (providers)
│   └── loading.tsx
│
├── components/             # Componentes reutilizáveis
│   ├── hook-form/         # Inputs integrados com RHF
│   ├── table/             # Componentes de tabela
│   └── guard/             # AuthGuard, GuestGuard
│
├── context/               # Contextos React
│   └── auth/              # AuthContext + AuthProvider
│
├── hooks/                 # Custom hooks
│   └── use-auth-context.ts
│
├── layouts/               # Layouts da aplicação
│   ├── auth/              # Layout simples (login)
│   └── dashboard/         # Layout com navegação
│
├── models/                # Interfaces e Types
│   ├── auth/
│   └── dashboard/
│       └── [entidade].ts
│
├── routes/                # Configuração de rotas
│   ├── pages.ts           # Central de rotas
│   └── hooks/             # useRouter, usePathname
│
├── screens/               # Telas (Presentation Layer)
│   ├── auth/              # LoginView, ForgotPasswordView
│   ├── common/error/      # Telas de erro
│   └── dashboard/
│       └── [modulo]/
│           └── [entidade]/
│               ├── views/         # List, Create, Edit, View
│               ├── components/    # Componentes específicos
│               ├── enums/         # Constantes, headers
│               └── index.ts
│
├── services/              # API (Infrastructure Layer)
│   ├── config-service.ts  # Config Axios
│   ├── auth/
│   └── dashboard/
│       └── [entidade]-service.ts
│
├── theme/                 # Configuração MUI
│   ├── locales/          # i18n
│   ├── overrides/        # Overrides MUI
│   └── palette.ts
│
└── utils/                 # Utilitários
```

---

## 🎯 Regras de Código (OBRIGATÓRIAS)

### 1. Diretivas
```typescript
// ✅ SEMPRE use 'use client' para componentes com hooks/estado
'use client';

// ✅ Separador de seções (60 hífens)
// ----------------------------------------------------------------------

// ✅ Use EXPORTS NOMEADOS (nunca default export)
export function ComponentName() { }

// ✅ Interfaces com prefixo I
interface IUser { }
interface IEntityProps { }

// ✅ Services com sufixo Service
const userService = { }

// ✅ Hooks com prefixo use
const useCustomHook = () => { }
```

### 2. Ordem de Imports
```typescript
// 1. React/Next
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Terceiros (MUI, Axios, etc)
import { Card } from '@mui/material';
import { useForm } from 'react-hook-form';

// [LINHA EM BRANCO]

// 3. Internos (@/*)
import { Breadcrumbs } from '@/components';
import { IUser } from '@/models';
import { pages } from '@/routes';

// [LINHA EM BRANCO]

// 4. Relativos (./)
import { ENTITY_ENUM } from '../enums';
```

### 3. Naming Conventions
| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Pastas/Arquivos | kebab-case | `user-list/`, `create-view.tsx` |
| Componentes | PascalCase | `UserListView` |
| Interfaces | PascalCase + I | `IUser`, `IEntityProps` |
| Services | camelCase + Service | `userService` |
| Hooks | use + camelCase | `useAuthContext` |

---

## 🧩 Padrões por Camada

### 1. App Router (page.tsx)
```typescript
// Apenas importa e renderiza a View
import { EntityListView } from '@/screens/dashboard/module/entity/views';

export default function EntityListPage() {
  return <EntityListView />;
}
```

### 2. Screens (Views)
```typescript
'use client';

// List View
export function EntityListView() {
  const router = useRouter();
  const { methods } = useTableApi<IEntity>({ modulo: 'entity' });
  
  // Buscar dados
  // Renderizar tabela com TableActions
}

// Create/Edit View
export function EntityCreateView() {
  const methods = useForm<IEntityCreate>({
    resolver: yupResolver(entityResolver),
    defaultValues: ENTITY_ENUM.DEFAULT_VALUES,
  });
  
  // Breadcrumbs + Card + EntityForm
}
```

### 3. Services
```typescript
'use client';

import { api } from '@/services';

const ENDPOINT = '/entities';

async function findAll(): Promise<IEntity[]> {
  const response = await api.local.fiscal.get(ENDPOINT);
  return response.data;
}

async function create(payload: IEntityCreate): Promise<IEntity> {
  const response = await api.local.fiscal.post(ENDPOINT, payload);
  return response.data;
}

export const entityService = { findAll, create, update, remove };
```

### 4. Models
```typescript
export interface IEntity {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface IEntityCreate {
  name: string;
  status: 'active' | 'inactive';
}

export interface IEntityUpdate extends Partial<IEntityCreate> {}
```

### 5. Routes (pages.ts)
```typescript
const LAYOUTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

export const pages = {
  auth: {
    login: { path: `${LAYOUTS.AUTH}/login` },
  },
  dashboard: {
    root: { path: LAYOUTS.DASHBOARD },
    module: {
      list: { path: `${LAYOUTS.DASHBOARD}/module/list` },
      create: { path: `${LAYOUTS.DASHBOARD}/module/create` },
      edit: { path: (id: string) => `${LAYOUTS.DASHBOARD}/module/${id}/edit` },
    },
  },
};
```

---

## 🚀 Criando um Novo Módulo (CRUD)

### Passo 1: Model (`src/models/dashboard/entity.ts`)
```typescript
export interface IEntity {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

export interface IEntityCreate {
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

export type IEntityUpdate = Partial<IEntityCreate>;
```

### Passo 2: Service (`src/services/dashboard/entity-service.ts`)
```typescript
const ENDPOINT = '/entities';

export const entityService = {
  list: () => api.local.fiscal.get(ENDPOINT).then(r => r.data),
  create: (data: IEntityCreate) => api.local.fiscal.post(ENDPOINT, data).then(r => r.data),
  update: (id: string, data: IEntityUpdate) => api.local.fiscal.put(`${ENDPOINT}/${id}`, data).then(r => r.data),
  delete: (id: string) => api.local.fiscal.delete(`${ENDPOINT}/${id}`),
};
```

### Passo 3: Routes (`src/routes/pages.ts`)
```typescript
entity: {
  list: { path: `${LAYOUTS.DASHBOARD}/entity/list` },
  create: { path: `${LAYOUTS.DASHBOARD}/entity/create` },
  edit: { path: (id: string) => `${LAYOUTS.DASHBOARD}/entity/${id}/edit` },
}
```

### Passo 4: Navigation (`src/layouts/dashboard/dashboard-config-navigation.tsx`)
```typescript
{
  title: t('entidades'),
  path: '#disabled',
  icon: ICONS.entity,
  children: [
    { title: t('listar'), path: pages.dashboard.entity.list.path },
    { title: t('criar'), path: pages.dashboard.entity.create.path },
  ],
}
```

### Passo 5: Views (`src/screens/dashboard/entity/views/`)
- `entity-list-view.tsx` - Tabela com ações
- `entity-create-view.tsx` - Formulário
- `entity-edit-view.tsx` - Formulário com dados

### Passo 6: Pages (`src/app/dashboard/entity/`)
```
list/page.tsx      → import { EntityListView }
create/page.tsx    → import { EntityCreateView }
[id]/edit/page.tsx → import { EntityEditView }
```

---

## ⚙️ Configurações Importantes

### Environment (.env)
```env
NEXT_PUBLIC_CENTRAL_API=https://api.central.com
NEXT_PUBLIC_LOCAL_API=http://localhost:8080/api
```

### API Config (`src/services/config-service.ts`)
```typescript
export const api = {
  auth: axios.create({ baseURL: CENTRAL_API }),
  local: {
    fiscal: axios.create({ baseURL: `${LOCAL_API}/api` }),
  },
};
```

---

## ✅ Checklist Rápido - Novo Módulo

- [ ] `'use client'` em componentes com hooks
- [ ] Separador `// ----------------------------------------------------------------------` entre seções
- [ ] Exports nomeados (não default)
- [ ] Interfaces com prefixo `I`
- [ ] Services exportados como objeto
- [ ] Rotas definidas em `pages.ts`
- [ ] Navegação atualizada em `dashboard-config-navigation.tsx`

---

## ✅ Checklist - Novo Projeto (OBRIGATÓRIO)

### Setup Inicial
- [ ] Copiar `package.json`, `tsconfig.json`, `next.config.js` do template
- [ ] Alterar apenas `name` no package.json
- [ ] Criar `.env.example` com URL da API
- [ ] Criar `.env` local (não versionar)
- [ ] Criar `Dockerfile` (se necessário container)
- [ ] Criar `README.md` com instruções de como rodar

### Configuração
- [ ] Verificar path aliases no tsconfig.json
- [ ] Configurar ThemeProvider
- [ ] Configurar SnackbarProvider
- [ ] Configurar AuthProvider
- [ ] Verificar CORS configurado no backend

### Primeira Tela
- [ ] Testar login integrado com backend
- [ ] Verificar se token está sendo salvo
- [ ] Testar navegação protegida

---

## 🚨 Anti-Patterns (NUNCA FAÇA)

❌ `export default` - use named exports  
❌ `var` - use `const`/`let`  
❌ `any` sem necessidade - crie interfaces  
❌ Lógica de API nas views - use services  
❌ Cores hardcoded - use `theme.palette`  
❌ Componentes >300 linhas - divida  

---

## 📚 Para Mais Detalhes

Veja `PROJECT_STANDARD.md` para documentação completa com exemplos detalhados.
