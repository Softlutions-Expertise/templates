# NEXT.JS PROJECT ARCHITECTURE STANDARD

> **Template de arquitetura para projetos Next.js 13+ com TypeScript e Material-UI**
> 
> **Stack:** Next.js 13+ (App Router), TypeScript, Material-UI v5, React Hook Form, Zustand/SWR  
> **Arquitetura:** Feature-based, Layered Architecture

---

## 📋 SUMÁRIO

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Arquitetura em Camadas](#2-arquitetura-em-camadas)
3. [Estrutura de Diretórios](#3-estrutura-de-diretórios)
4. [Padrões de Código](#4-padrões-de-código)
5. [App Router (Next.js 13+)](#5-app-router-nextjs-13)
6. [State Management](#6-state-management)
7. [Services & API](#7-services--api)
8. [Models & Types](#8-models--types)
9. [Componentes](#9-componentes)
10. [Autenticação](#10-autenticação)
11. [Temas & Estilos](#11-temas--estilos)
12. [Rotas & Navegação](#12-rotas--navegação)
13. [Padrão CRUD Completo](#13-padrão-crud-completo)
14. [Configurações](#14-configurações)

---

## 1. STACK TECNOLÓGICO

```yaml
Core:
  Framework: Next.js 13.4+ (App Router)
  Linguagem: TypeScript 5.1+
  Runtime: Node.js >= 20.x

UI/UX:
  Component Library: Material-UI (MUI) v5
  Icons: @iconify/react + SVG custom
  Animações: Framer Motion
  Notificações: Notistack
  Progresso: NProgress

Formulários:
  Form Management: React Hook Form
  Validação: Yup
  Componentes: @softlutions/components (opcional)

Data & State:
  HTTP Client: Axios
  Server State: SWR / TanStack Query
  Client State: Zustand / Context API
  Persistência: localStorage/sessionStorage utilities

Utilitários:
  Date: date-fns
  Utils: lodash
  PDF: @react-pdf/renderer (quando necessário)
  Calendário: FullCalendar (quando necessário)
```

---

## 2. ARQUITETURA EM CAMADAS

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  App Router │  │   Screens   │  │   Components        │  │
│  │  (Next.js)  │  │  (Views)    │  │   (Reutilizáveis)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   APPLICATION LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Hooks    │  │  Contexts   │  │   Route Guards      │  │
│  │  (Custom)   │  │   (Global)  │  │   (Auth/Role)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    DOMAIN LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Models    │  │   Enums     │  │   Validations       │  │
│  │ (Interfaces)│  │ (Constants) │  │   (Yup)             │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE LAYER                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Services  │  │    API      │  │   Utilities         │  │
│  │  (Business) │  │   (Axios)   │  │   (Helpers)         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. ESTRUTURA DE DIRETÓRIOS

```
my-project/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/              # Route Group (landing, about, etc)
│   │   │   ├── page.tsx              # Landing page
│   │   │   └── layout.tsx
│   │   │
│   │   ├── auth/                     # Rotas públicas de autenticação
│   │   │   ├── login/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx          # Importa LoginView
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── dashboard/                # Área logada (protegida)
│   │   │   ├── layout.tsx            # Layout com AuthGuard + DashboardLayout
│   │   │   ├── page.tsx              # Home do dashboard
│   │   │   │
│   │   │   ├── module-a/             # Módulo A (ex: users)
│   │   │   │   └── entity/
│   │   │   │       ├── list/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── create/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── [id]/
│   │   │   │           ├── edit/
│   │   │   │           │   └── page.tsx
│   │   │   │           └── view/
│   │   │   │               └── page.tsx
│   │   │   │
│   │   │   └── module-b/             # Módulo B (ex: products)
│   │   │       └── ...
│   │   │
│   │   ├── error/                    # Páginas de erro
│   │   │   ├── 403/
│   │   │   ├── 404/
│   │   │   └── 500/
│   │   │
│   │   ├── layout.tsx                # Root layout (providers globais)
│   │   ├── loading.tsx               # Loading global
│   │   ├── not-found.tsx             # 404 global
│   │   └── page.tsx                  # Redirect para /auth/login ou /dashboard
│   │
│   ├── assets/                       # Assets estáticos
│   │   ├── icons/
│   │   └── illustrations/
│   │
│   ├── components/                   # Componentes reutilizáveis
│   │   ├── animate/                  # Animações (Framer Motion)
│   │   ├── breadcrumbs/              # Navegação hierárquica
│   │   ├── button/                   # Botões customizados
│   │   ├── container/                # Wrappers de layout
│   │   ├── custom/                   # Componentes específicos do domínio
│   │   ├── empty-content/            # Estados vazios
│   │   ├── guard/                    # AuthGuard, GuestGuard, RoleGuard
│   │   ├── hook-form/                # Inputs integrados com RHF
│   │   ├── iconify/                  # Wrapper de ícones
│   │   ├── loading-screen/           # Telas de loading
│   │   ├── logo/
│   │   ├── scrollbar/                # Scrollbar customizado
│   │   ├── settings/                 # Configurações de tema
│   │   ├── snackbar/                 # Notificações (Notistack)
│   │   ├── svg-color/                # SVGs com cores dinâmicas
│   │   ├── table/                    # Componentes de tabela
│   │   │   ├── table-actions.tsx
│   │   │   ├── table-head-custom.tsx
│   │   │   ├── table-no-data.tsx
│   │   │   └── use-table-api.ts      # Hook de controle de tabela
│   │   └── ...
│   │
│   ├── context/                      # Contextos React (estado global)
│   │   ├── auth/
│   │   │   ├── auth-context.tsx      # Criação do context
│   │   │   ├── auth-provider.tsx     # Provider com lógica
│   │   │   ├── auth-consumer.tsx     # Loader/Validação
│   │   │   ├── utils.ts              # Funções auxiliares (token, session)
│   │   │   └── index.ts              # Barrel export
│   │   └── index.ts
│   │
│   ├── hooks/                        # Hooks customizados
│   │   ├── use-auth-context.ts       # Acesso ao contexto de auth
│   │   ├── use-responsive.ts         # Breakpoints do MUI
│   │   └── ...
│   │
│   ├── layouts/                      # Layouts da aplicação
│   │   ├── auth/                     # Layout simples (telas de login)
│   │   ├── common/                   # Componentes compartilhados
│   │   │   ├── account-popover.tsx
│   │   │   ├── header-shadow.tsx
│   │   │   ├── language-popover.tsx
│   │   │   ├── nav-section/          # Navegação (vertical/horizontal/mini)
│   │   │   ├── searchbar/
│   │   │   └── settings-button.tsx
│   │   ├── compact/
│   │   ├── dashboard/                # Layout principal logado
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── dashboard-header.tsx
│   │   │   ├── dashboard-nav-vertical.tsx
│   │   │   ├── dashboard-nav-horizontal.tsx
│   │   │   └── dashboard-config-navigation.tsx  # Config do menu
│   │   └── simple/
│   │
│   ├── models/                       # Interfaces e Types (Domain Layer)
│   │   ├── auth/
│   │   │   └── auth-models.ts
│   │   ├── common/
│   │   │   └── common-models.ts
│   │   └── dashboard/
│   │       ├── module-a/
│   │       │   └── entity-model.ts
│   │       └── module-b/
│   │
│   ├── routes/                       # Configuração de rotas
│   │   ├── components/
│   │   │   └── router-link.tsx       # Link wrapper
│   │   ├── hooks/
│   │   │   ├── use-router.ts         # Re-export next/navigation
│   │   │   ├── use-pathname.ts
│   │   │   ├── use-active-link.ts
│   │   │   └── use-role-pathname.ts  # Verificação de permissões
│   │   └── pages.ts                  # Central de definição de rotas
│   │
│   ├── screens/                      # Telas/Páginas (Presentation Layer)
│   │   ├── auth/                     # Telas de autenticação
│   │   │   ├── login-view.tsx
│   │   │   ├── register-view.tsx
│   │   │   └── forgot-password-view.tsx
│   │   │
│   │   ├── common/error/             # Telas de erro
│   │   │   ├── error-403-view.tsx
│   │   │   └── error-404-view.tsx
│   │   │
│   │   └── dashboard/                # Telas do dashboard
│   │       ├── home/
│   │       │   └── home-view.tsx
│   │       │
│   │       └── module-a/             # Estrutura por módulo
│   │           └── entity/
│   │               ├── components/   # Componentes específicos
│   │               │   └── entity-form.tsx
│   │               │
│   │               ├── enums/        # Constantes, headers
│   │               │   └── entity-enum.ts
│   │               │
│   │               ├── resolver/     # Validações Yup
│   │               │   └── entity-resolver.ts
│   │               │
│   │               ├── views/        # Views principais
│   │               │   ├── entity-list-view.tsx
│   │               │   ├── entity-create-view.tsx
│   │               │   ├── entity-edit-view.tsx
│   │               │   └── entity-detail-view.tsx
│   │               │
│   │               └── index.ts      # Barrel export
│   │
│   ├── services/                     # Camada de API (Infrastructure)
│   │   ├── auth/
│   │   │   └── auth-service.ts
│   │   ├── common/
│   │   │   └── common-service.ts
│   │   ├── config-service.ts         # Configuração Axios
│   │   └── dashboard/
│   │       └── module-a/
│   │           └── entity/
│   │               └── entity-service.ts
│   │
│   ├── theme/                        # Configuração de tema MUI
│   │   ├── locales/                  # i18n config
│   │   ├── options/                  # Opções de tema
│   │   ├── overrides/                # Overrides de componentes MUI
│   │   ├── index.tsx                 # ThemeProvider
│   │   ├── palette.ts                # Paleta de cores
│   │   ├── shadows.ts
│   │   └── typography.ts
│   │
│   └── utils/                        # Utilitários
│       ├── format-time.ts
│       ├── format-text.tsx
│       ├── mask.ts
│       ├── storage-available.ts
│       └── index.ts
│
├── .env                              # Variáveis de ambiente
├── .env.example
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── prettier.config.js
├── tsconfig.json
└── README.md
```

---

## 4. PADRÕES DE CÓDIGO

### 4.1 Regras Gerais

```typescript
// ✅ SEMPRE use 'use client' para componentes com hooks/estado
'use client';

// ✅ SEPARADOR de seções (60 hífens)
// ----------------------------------------------------------------------

// ✅ NOME de interfaces com prefixo I
interface IUser {
  id: number;
  name: string;
}

interface IEntityProps {
  data: IUser;
  onSubmit: (data: IUser) => void;
}

// ✅ EXPORTS nomeados (evite default export)
export function ComponentName() { }
export const helper = () => { };
export type MyType = { };

// ✅ USE arrow functions para componentes
export const UserCard = ({ data }: IEntityProps) => { };

// ✅ TIPO de retorno explícito em services
async function findAll(): Promise<IUser[]> { }

// ✅ USE const/let (nunca var)
const API_URL = 'https://api.example.com';
let currentUser: IUser | null = null;
```

### 4.2 Ordem de Imports (Prettier)

```typescript
// 1. React
import { useState, useEffect, useCallback } from 'react';

// 2. Next.js
import { useRouter } from 'next/navigation';

// 3. Terceiros (MUI, Axios, etc)
import axios from 'axios';
import { Card, Button } from '@mui/material';
import { useForm } from 'react-hook-form';

// [LINHA EM BRANCO]

// 4. Componentes internos (@/*)
import { Breadcrumbs, Container } from '@/components';
import { useAuthContext } from '@/hooks';
import { entityService } from '@/services';
import { IUser } from '@/models';

// [LINHA EM BRANCO]

// 5. Imports relativos (./ ../)
import { ENTITY_ENUM } from '../enums';
import { entityResolver } from '../resolver';
```

### 4.3 Naming Conventions

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes | PascalCase | `UserListView`, `AuthProvider` |
| Interfaces | PascalCase + prefixo I | `IUser`, `IEntityProps` |
| Types | PascalCase | `AuthStateType`, `ApiResponse` |
| Enums | PascalCase | `StatusEnum`, `UserType` |
| Funções | camelCase | `findAll`, `handleSubmit` |
| Variáveis | camelCase | `dataTable`, `isLoading` |
| Constantes | UPPER_SNAKE_CASE | `API_URL`, `STORAGE_KEY` |
| Arquivos de view | kebab-case | `user-list-view.tsx` |
| Services | camelCase + Suffix | `userService`, `authService` |
| Hooks | camelCase + prefixo use | `useAuthContext`, `useTableApi` |

---

## 5. APP ROUTER (NEXT.JS 13+)

### 5.1 Estrutura de Páginas

```typescript
// src/app/dashboard/module-a/entity/list/page.tsx
import { EntityListView } from '@/screens/dashboard/module-a/entity/views/entity-list-view';

// ----------------------------------------------------------------------

export default function EntityListPage() {
  return <EntityListView />;
}
```

### 5.2 Layouts

```typescript
// src/app/layout.tsx (ROOT)
import 'simplebar-react/dist/simplebar.min.css';
import 'src/theme/css.css';

import { AuthConsumer, AuthProvider } from '@/context';
import ThemeProvider from '@/theme';
import MotionLazy from '@/components/animate/motion-lazy';
import ProgressBar from '@/components/progress-bar';
import { SettingsProvider, SettingsDrawer } from '@/components/settings';
import { SnackbarProvider } from '@/components/snackbar';

export const metadata = {
  title: 'My App',
  description: 'Application description',
  keywords: 'app, management',
  themeColor: '#000000',
  manifest: '/manifest.json',
  icons: [...],
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          <SettingsProvider defaultSettings={{
            themeMode: 'dark',
            themeDirection: 'ltr',
            themeContrast: 'default',
            themeLayout: 'vertical',
            themeColorPresets: 'blue',
            themeStretch: true,
          }}>
            <ThemeProvider>
              <MotionLazy>
                <SnackbarProvider>
                  <SettingsDrawer />
                  <ProgressBar />
                  <AuthConsumer>{children}</AuthConsumer>
                </SnackbarProvider>
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

```typescript
// src/app/dashboard/layout.tsx (PROTECTED)
'use client';

import { AuthGuard } from '@/components';
import { useAuthContext } from '@/hooks';
import { DashboardLayout } from '@/layouts';
import { usePathname, useRolePathname, useRouter } from '@/routes';
import { useCheckRole } from '@/hooks/use-check-role';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function DashboardRootLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthContext();
  const { checkRole } = useCheckRole();

  useEffect(() => {
    const roles = useRolePathname(pathname)?.roles;
    if (roles?.length > 0 && !checkRole(roles)) {
      logout();
      router.replace('/auth/login');
    }
  }, [pathname]);

  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
```

### 5.3 Dynamic Routes

```typescript
// src/app/dashboard/module-a/entity/[id]/edit/page.tsx
import { EntityEditView } from '@/screens/dashboard/module-a/entity/views/entity-edit-view';

interface Props {
  params: { id: string };
}

export default function EntityEditPage({ params }: Props) {
  return <EntityEditView id={params.id} />;
}
```

---

## 6. STATE MANAGEMENT

### 6.1 Context Pattern (Reducer)

```typescript
// src/context/auth/auth-context.tsx
'use client';

import { createContext } from 'react';
import { IAuthContext } from '@/models';

// ----------------------------------------------------------------------

export const AuthContext = createContext({} as IAuthContext);
```

```typescript
// src/context/auth/auth-provider.tsx
'use client';

import { IActionMap, IAuthState, IUser } from '@/models';
import { pages, useRouter } from '@/routes';
import { authService, userService } from '@/services';
import { getLocalItem, getSessionItem, setLocalItem } from '@/utils';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: { user: IUser | null };
  [Types.LOGIN]: { user: IUser };
  [Types.LOGOUT]: undefined;
};

type Actions = IActionMap<Payload>[keyof IActionMap<Payload>];

// ----------------------------------------------------------------------

const initialState: IAuthState = {
  user: null,
  loading: true,
};

const reducer = (state: IAuthState, action: Actions): IAuthState => {
  switch (action.type) {
    case Types.INITIAL:
      return { loading: false, user: action.payload.user };
    case Types.LOGIN:
      return { ...state, user: action.payload.user };
    case Types.LOGOUT:
      return { ...state, user: null };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = getSessionItem(STORAGE_KEY);
      
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const user = await userService.show();
        dispatch({ type: Types.INITIAL, payload: { user } });
      } else {
        dispatch({ type: Types.INITIAL, payload: { user: null } });
      }
    } catch (error) {
      dispatch({ type: Types.INITIAL, payload: { user: null } });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken } = await authService.login({ email, password });
    setSession(accessToken);
    setLocalItem('authorization', accessToken);
    
    const user = await userService.show();
    dispatch({ type: Types.LOGIN, payload: { user } });
  }, []);

  const logout = useCallback(async () => {
    setSession(null);
    dispatch({ type: Types.LOGOUT });
    router.replace('/auth/login');
  }, [router]);

  const value = useMemo(
    () => ({
      user: state.user,
      loading: state.loading,
      authenticated: !!state.user,
      login,
      logout,
    }),
    [state.user, state.loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### 6.2 Hook de Consumo

```typescript
// src/hooks/use-auth-context.ts
'use client';

import { AuthContext } from '@/context';
import { useContext } from 'react';

// ----------------------------------------------------------------------

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return context;
};
```

---

## 7. SERVICES & API

### 7.1 Configuração Base

```typescript
// src/services/config-service.ts
'use client';

import axios from 'axios';

// ----------------------------------------------------------------------

const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment
  ? process.env.NEXT_PUBLIC_API_URL_LOCAL
  : process.env.NEXT_PUBLIC_API_URL_PROD;

// ----------------------------------------------------------------------

const api = {
  auth: axios.create({ baseURL: `${API_BASE_URL}/auth` }),
  users: axios.create({ baseURL: `${API_BASE_URL}/users` }),
  entities: axios.create({ baseURL: `${API_BASE_URL}/entities` }),
  // Adicione outros módulos conforme necessário
};

// Interceptors
api.entities.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
```

### 7.2 Service Pattern

```typescript
// src/services/dashboard/module-a/entity/entity-service.ts
'use client';

import { IEntity, IEntityCreate, IEntityUpdate } from '@/models';
import { api } from '@/services';

// ----------------------------------------------------------------------

async function findAll(): Promise<IEntity[]> {
  const response = await api.entities.get('/');
  return response.data;
}

async function findById(id: string | number): Promise<IEntity> {
  const response = await api.entities.get(`/${id}`);
  return response.data;
}

async function create(payload: IEntityCreate): Promise<IEntity> {
  const response = await api.entities.post('/', payload);
  return response.data;
}

async function update(id: string | number, payload: IEntityUpdate): Promise<IEntity> {
  const response = await api.entities.put(`/${id}`, payload);
  return response.data;
}

async function remove(id: string | number): Promise<void> {
  await api.entities.delete(`/${id}`);
}

export const entityService = {
  findAll,
  findById,
  create,
  update,
  remove,
};
```

---

## 8. MODELS & TYPES

### 8.1 Estrutura

```typescript
// src/models/auth/auth-models.ts

export interface IUser {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface IAuthState {
  user: IUser | null;
  loading: boolean;
}

export interface IAuthContext extends IAuthState {
  authenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export type IActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? { type: Key }
    : { type: Key; payload: M[Key] };
};
```

```typescript
// src/models/dashboard/module-a/entity-model.ts

export interface IEntity {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface IEntityCreate {
  name: string;
  description: string;
}

export interface IEntityUpdate extends Partial<IEntityCreate> {
  status?: 'active' | 'inactive';
}

export interface IEntityFilter {
  name?: string;
  status?: string;
}

// Para listagens simplificadas
export interface IEntityListItem {
  id: number;
  name: string;
  status: string;
}
```

---

## 9. COMPONENTES

### 9.1 Componente de Breadcrumbs

```typescript
// src/components/breadcrumbs/breadcrumbs.tsx
'use client';

import { Breadcrumbs as MUIBreadcrumbs, Link, Typography, Button, Box } from '@mui/material';
import { Iconify } from '@/components';
import { useRouter } from '@/routes';

// ----------------------------------------------------------------------

interface ILink {
  name: string;
  href?: string;
}

interface IAction {
  type: 'create' | 'back' | 'custom';
  route?: string;
  label: string;
  onClick?: () => void;
  icon?: string;
}

interface IBreadcrumbsProps {
  heading: string;
  links: ILink[];
  action?: IAction;
}

// ----------------------------------------------------------------------

export function Breadcrumbs({ heading, links, action }: IBreadcrumbsProps) {
  const router = useRouter();

  const handleAction = () => {
    if (action?.onClick) {
      action.onClick();
    } else if (action?.route) {
      router.push(action.route);
    }
  };

  const getIcon = () => {
    switch (action?.type) {
      case 'create': return 'eva:plus-fill';
      case 'back': return 'eva:arrow-back-fill';
      default: return action?.icon || 'eva:checkmark-fill';
    }
  };

  return (
    <Box>
      <MUIBreadcrumbs sx={{ mb: 1 }}>
        {links.map((link, index) => {
          const isLast = index === links.length - 1;
          return isLast ? (
            <Typography key={link.name} color="text.primary">
              {link.name}
            </Typography>
          ) : (
            <Link 
              key={link.name} 
              href={link.href} 
              color="inherit"
              underline="hover"
            >
              {link.name}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">{heading}</Typography>
        
        {action && (
          <Button
            variant="contained"
            startIcon={<Iconify icon={getIcon()} />}
            onClick={handleAction}
          >
            {action.label}
          </Button>
        )}
      </Box>
    </Box>
  );
}
```

### 9.2 Barrel Export

```typescript
// src/components/breadcrumbs/index.ts
export * from './breadcrumbs';

// src/components/index.ts
export { useSnackbar } from 'notistack';
export * from './animate';
export * from './breadcrumbs';
export * from './button';
export * from './container';
export * from './guard';
export * from './hook-form';
export * from './iconify';
export * from './loading-screen';
export * from './settings';
export * from './snackbar';
export * from './table';
```

---

## 10. AUTENTICAÇÃO

### 10.1 Auth Guard

```typescript
// src/components/guard/auth-guard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/routes';
import { useAuthContext } from '@/hooks';
import { LoadingScreen } from '@/components';

interface Props {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

export function AuthGuard({ children }: Props) {
  const router = useRouter();
  const { authenticated, loading } = useAuthContext();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!authenticated) {
        router.replace('/auth/login');
      } else {
        setChecked(true);
      }
    }
  }, [authenticated, loading, router]);

  if (!checked) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
```

### 10.2 Guest Guard (para páginas de login)

```typescript
// src/components/guard/guest-guard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from '@/routes';
import { useAuthContext } from '@/hooks';
import { LoadingScreen } from '@/components';

interface Props {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

export function GuestGuard({ children }: Props) {
  const router = useRouter();
  const { authenticated, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && authenticated) {
      router.replace('/dashboard');
    }
  }, [authenticated, loading, router]);

  if (loading || authenticated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
```

---

## 11. TEMAS & ESTILOS

### 11.1 Paleta de Cores

```typescript
// src/theme/palette.ts
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}

// ----------------------------------------------------------------------

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

const PRIMARY = {
  lighter: '#C8FAD6',
  light: '#5BE49B',
  main: '#00A76F',
  dark: '#007867',
  darker: '#004B50',
  contrastText: '#FFFFFF',
};

const SECONDARY = {
  lighter: '#EFD6FF',
  light: '#C684FF',
  main: '#8E33FF',
  dark: '#5119B7',
  darker: '#27097A',
  contrastText: '#FFFFFF',
};

const INFO = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#FFFFFF',
};

const SUCCESS = {
  lighter: '#D3FCD2',
  light: '#77ED8B',
  main: '#22C55E',
  dark: '#118D57',
  darker: '#065E49',
  contrastText: '#ffffff',
};

const WARNING = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};

const COMMON = {
  common: { black: '#000000', white: '#FFFFFF' },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.2),
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export function palette(mode: 'light' | 'dark') {
  const light = {
    ...COMMON,
    mode: 'light',
    text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
    background: { paper: '#FFFFFF', default: '#FFFFFF', neutral: GREY[200] },
    action: { ...COMMON.action, active: GREY[600] },
  };

  const dark = {
    ...COMMON,
    mode: 'dark',
    text: { primary: '#FFFFFF', secondary: GREY[500], disabled: GREY[600] },
    background: { paper: GREY[800], default: GREY[900], neutral: alpha(GREY[500], 0.12) },
    action: { ...COMMON.action, active: GREY[500] },
  };

  return mode === 'light' ? light : dark;
}
```

---

## 12. ROTAS & NAVEGAÇÃO

### 12.1 Central de Rotas

```typescript
// src/routes/pages.ts

// ----------------------------------------------------------------------

const LAYOUTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const pages = {
  // Errors
  page403: { path: '/error/403' },
  page404: { path: '/error/404' },
  page500: { path: '/error/500' },
  
  // Auth
  auth: {
    login: { path: `${LAYOUTS.AUTH}/login` },
    register: { path: `${LAYOUTS.AUTH}/register` },
    forgotPassword: { path: `${LAYOUTS.AUTH}/forgot-password` },
  },
  
  // Dashboard
  dashboard: {
    root: { path: LAYOUTS.DASHBOARD },
    
    // Módulo A
    moduleA: {
      entity: {
        list: { path: `${LAYOUTS.DASHBOARD}/module-a/entity/list` },
        create: { path: `${LAYOUTS.DASHBOARD}/module-a/entity/create` },
        edit: { 
          path: (id: string | number) => `${LAYOUTS.DASHBOARD}/module-a/entity/${id}/edit` 
        },
        view: { 
          path: (id: string | number) => `${LAYOUTS.DASHBOARD}/module-a/entity/${id}/view` 
        },
      },
    },
    
    // Módulo B
    moduleB: {
      list: { path: `${LAYOUTS.DASHBOARD}/module-b/list` },
      create: { path: `${LAYOUTS.DASHBOARD}/module-b/create` },
      edit: { 
        path: (id: string | number) => `${LAYOUTS.DASHBOARD}/module-b/${id}/edit` 
      },
    },
  },
};
```

### 12.2 Hooks de Navegação

```typescript
// src/routes/hooks/use-router.ts
export { useRouter } from 'next/navigation';

// src/routes/hooks/use-pathname.ts  
export { usePathname } from 'next/navigation';

// src/routes/hooks/use-active-link.ts
'use client';

import { usePathname } from './use-pathname';

// ----------------------------------------------------------------------

export function useActiveLink(path: string, deep = true) {
  const pathname = usePathname();
  const normalActive = path === pathname;
  const deepActive = pathname.startsWith(path);
  
  return {
    active: deep ? deepActive : normalActive,
    isExternalLink: path.startsWith('http'),
  };
}
```

---

## 13. PADRÃO CRUD COMPLETO

### 13.1 Estrutura de Feature

```
src/screens/dashboard/module-a/entity/
├── components/
│   └── entity-form.tsx           # Formulário reutilizável
├── enums/
│   └── entity-enum.ts            # Constantes, headers de tabela
├── resolver/
│   └── entity-resolver.ts        # Schema Yup
├── views/
│   ├── entity-list-view.tsx      # Listagem
│   ├── entity-create-view.tsx    # Criação
│   ├── entity-edit-view.tsx      # Edição
│   └── entity-detail-view.tsx    # Visualização
└── index.ts
```

### 13.2 List View

```typescript
// src/screens/dashboard/module-a/entity/views/entity-list-view.tsx
'use client';

import {
  Breadcrumbs,
  Container,
  Iconify,
  Scrollbar,
  TableActions,
  TableNoData,
  useTableApi,
} from '@/components';
import { IEntityListItem } from '@/models';
import { pages, useRouter } from '@/routes';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useError } from '@/hooks/use-error';
import { useEffect } from 'react';

import { ENTITY_ENUM } from '../enums';
import { entityService } from '@/services';

// ----------------------------------------------------------------------

export function EntityListView() {
  const router = useRouter();
  const handleError = useError();

  const { methods } = useTableApi<IEntityListItem>({ modulo: 'entity' });
  const { setValue, watch, handleSubmit } = methods;
  const { dataTable, dense, loading } = watch();

  const fetchData = () => {
    setValue('loading', true);
    entityService
      .findAll()
      .then((response) => setValue('dataTable', response))
      .catch((error) => handleError(error, 'Erro ao carregar dados'))
      .finally(() => setValue('loading', false));
  };

  const handleDelete = async (id: number) => {
    try {
      await entityService.remove(id);
      fetchData();
    } catch (error) {
      handleError(error, 'Erro ao excluir');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <Breadcrumbs
        heading="Listagem"
        links={[
          { name: 'Dashboard', href: pages.dashboard.root.path },
          { name: 'Entidades', href: pages.dashboard.moduleA.entity.list.path },
          { name: 'Lista' },
        ]}
        action={{
          type: 'create',
          route: pages.dashboard.moduleA.entity.create.path,
          label: 'Novo',
        }}
      />

      <Card>
        <TableContainer>
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  {ENTITY_ENUM.TABLE_HEADER.map((item) => (
                    <TableCell key={item.id} sx={item.sx} align={item.align}>
                      {item.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataTable?.map((item) => (
                  <TableRow hover key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell align="right">
                      <TableActions
                        row={item}
                        view={{
                          onClick: () => router.push(
                            pages.dashboard.moduleA.entity.view.path(item.id)
                          ),
                        }}
                        edit={{
                          onClick: () => router.push(
                            pages.dashboard.moduleA.entity.edit.path(item.id)
                          ),
                        }}
                        delete={{
                          onClick: () => handleDelete(item.id),
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableNoData isNotFound={!dataTable?.length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>
    </Container>
  );
}
```

### 13.3 Enums

```typescript
// src/screens/dashboard/module-a/entity/enums/entity-enum.ts

export const ENTITY_ENUM = {
  TABLE_HEADER: [
    { id: 'id', label: 'Código', sx: { width: '10%' } },
    { id: 'name', label: 'Nome', sx: { width: '40%' } },
    { id: 'status', label: 'Status', sx: { width: '20%' } },
    { id: 'actions', label: '', sx: { width: '10%' }, align: 'right' as const },
  ],
  
  STATUS_OPTIONS: [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
  ],
  
  DEFAULT_VALUES: {
    name: '',
    description: '',
    status: 'active',
  },
};
```

### 13.4 Resolver (Yup)

```typescript
// src/screens/dashboard/module-a/entity/resolver/entity-resolver.ts
import * as Yup from 'yup';

// ----------------------------------------------------------------------

export const entityResolver = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório').min(3, 'Mínimo 3 caracteres'),
  description: Yup.string(),
  status: Yup.string().oneOf(['active', 'inactive']).required(),
});
```

### 13.5 Create/Edit View

```typescript
// src/screens/dashboard/module-a/entity/views/entity-create-view.tsx
'use client';

import { Breadcrumbs, Container } from '@/components';
import { IEntityCreate } from '@/models';
import { pages, useRouter } from '@/routes';
import { entityService } from '@/services';
import { Card, Box } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useError } from '@/hooks/use-error';

import { ENTITY_ENUM } from '../enums';
import { entityResolver } from '../resolver';
import { EntityForm } from '../components/entity-form';

// ----------------------------------------------------------------------

export function EntityCreateView() {
  const router = useRouter();
  const handleError = useError();

  const methods = useForm<IEntityCreate>({
    resolver: yupResolver(entityResolver),
    defaultValues: ENTITY_ENUM.DEFAULT_VALUES,
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: IEntityCreate) => {
    try {
      await entityService.create(data);
      router.push(pages.dashboard.moduleA.entity.list.path);
    } catch (error) {
      handleError(error, 'Erro ao criar');
    }
  };

  return (
    <Container>
      <Breadcrumbs
        heading="Nova Entidade"
        links={[
          { name: 'Dashboard', href: pages.dashboard.root.path },
          { name: 'Entidades', href: pages.dashboard.moduleA.entity.list.path },
          { name: 'Novo' },
        ]}
      />

      <Card>
        <Box sx={{ p: 3 }}>
          <EntityForm
            methods={methods}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={() => router.push(pages.dashboard.moduleA.entity.list.path)}
          />
        </Box>
      </Card>
    </Container>
  );
}
```

---

## 14. CONFIGURAÇÕES

### 14.1 TypeScript

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noEmit": true,
    "allowJs": true,
    "jsx": "preserve",
    "module": "esnext",
    "incremental": true,
    "skipLibCheck": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "strictNullChecks": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "noFallthroughCasesInSwitch": true,
    "useUnknownInCatchVariables": false,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 14.2 Next.js

```javascript
// next.config.js
module.exports = {
  trailingSlash: true,
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
```

### 14.3 Prettier

```javascript
// prettier.config.js
module.exports = {
  printWidth: 100,
  singleQuote: true,
  semi: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^prop-types',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/types/(.*)$',
    '^@/config/(.*)$',
    '^@/app/(.*)$',
    '^@/assets/(.*)$',
    '^@/components/(.*)$',
    '^@/context/(.*)$',
    '^@/hooks/(.*)$',
    '^@/layouts/(.*)$',
    '^@/routes/(.*)$',
    '^@/screens/(.*)$',
    '^@/services/(.*)$',
    '^@/theme/(.*)$',
    '^@/utils/(.*)$',
    '',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
};
```

### 14.4 Variáveis de Ambiente

```env
# .env.example
NODE_ENV=development

# API
NEXT_PUBLIC_API_URL_LOCAL=http://localhost:3001
NEXT_PUBLIC_API_URL_PROD=https://api.production.com

# Auth
NEXT_PUBLIC_JWT_SECRET=your-secret-key

# Outras integrações
NEXT_PUBLIC_ANALYTICS_ID=
```

---

## ✅ CHECKLIST PARA NOVOS PROJETOS

### Setup Inicial
- [ ] Configurar `tsconfig.json` com path alias `@/*`
- [ ] Configurar `next.config.js` com modularizeImports
- [ ] Configurar `prettier.config.js` com ordem de imports
- [ ] Criar estrutura de diretórios `src/{app,components,context,hooks,layouts,models,routes,screens,services,theme,utils}`
- [ ] Configurar ThemeProvider com paleta de cores
- [ ] Configurar SnackbarProvider para notificações
- [ ] Configurar AuthProvider com Context API

### Ao criar uma Feature
- [ ] Criar interfaces em `src/models/dashboard/{module}/{entity}.ts`
- [ ] Criar service em `src/services/dashboard/{module}/{entity}/{entity}-service.ts`
- [ ] Criar rotas em `src/routes/pages.ts`
- [ ] Criar views em `src/screens/dashboard/{module}/{entity}/views/`
- [ ] Criar pages em `src/app/dashboard/{module}/{entity}/{action}/page.tsx`
- [ ] Adicionar navegação em `src/layouts/dashboard/dashboard-config-navigation.tsx`

### Padrões de Código
- [ ] Usar `'use client'` em componentes com hooks/estado
- [ ] Usar separador `// ----------------------------------------------------------------------`
- [ ] Usar exports nomeados (não default)
- [ ] Interfaces com prefixo `I` (ex: `IUser`, `IEntityProps`)
- [ ] Services com sufixo `Service` (ex: `userService`)
- [ ] Hooks com prefixo `use` (ex: `useAuthContext`)
- [ ] Views com sufixo `View` (ex: `UserListView`)

---

## 🚨 ANTI-PATTERNS (NÃO FAZER)

❌ Não use `export default` - use named exports  
❌ Não use `var` - use `const` ou `let`  
❌ Não use `any` sem necessidade - crie interfaces  
❌ Não coloque lógica de API direto nas views - use services  
❌ Não use cores hardcoded - use `theme.palette`  
❌ Não crie componentes >300 linhas - divida em subcomponentes  
❌ Não ignore tratamento de erros - use `handleError`  
❌ Não acesse `window` sem verificar `typeof window !== 'undefined'`  

---

## 📝 NOTAS PARA IAs

Ao gerar código para este padrão:

1. **Sempre verifique** se o componente precisa de `'use client'`
2. **Use os componentes base** disponíveis em `@/components` (Breadcrumbs, Container, Table, etc)
3. **Siga a ordem de imports** do prettier config
4. **Para formulários**: use `react-hook-form` + `yup` + componentes de `@/components/hook-form`
5. **Para tabelas**: use o hook `useTableApi` e componentes de `@/components/table`
6. **Para navegação**: use o objeto `pages` de `@/routes/pages`
7. **Para erros**: use o hook `useError` para tratamento padronizado
8. **Para loading**: use o componente `LoadingScreen`

---

**Template Version:** 1.0  
**Next.js:** 13.4+  
**TypeScript:** 5.1+  
**Material-UI:** v5+
