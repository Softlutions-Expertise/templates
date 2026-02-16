# Stack: Next.js + NestJS

> Stack fullstack completa para desenvolvimento de aplicações web modernas

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND                                │
│  Next.js 13+ • TypeScript • Material-UI • React Hook Form   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND                                 │
│  NestJS 10+ • TypeScript • TypeORM • PostgreSQL • JWT       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Templates Utilizados

| Camada | Template | Path |
|--------|----------|------|
| Frontend | Next.js Template | [`front-end/next/`](../../front-end/next) |
| Backend | NestJS Template | [`back-end/nest/`](../../back-end/nest) |

---

## 🚀 Começando com esta Stack

### 1. Backend (NestJS)

```bash
cd back-end/nest

# Instalação
npm install
cp .env.example .env

# Com Docker (recomendado)
make up
make migrate

# Sem Docker
npm run start:dev  # Porta 3000
```

Documentação: [NestJS Template](../../back-end/nest/PROJECT_STANDARD.md)

### 2. Frontend (Next.js)

```bash
cd front-end/next

# Instalação
npm install
cp .env.example .env

# Desenvolvimento
npm run dev        # Porta 8084
```

Documentação: [Next.js Template](../../front-end/next/PROJECT_STANDARD.md)

---

## 🔗 Integração Front + Back

### Configuração de CORS (Backend)

O template NestJS já vem configurado com CORS habilitado em `main.ts`:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8084',
  credentials: true,
});
```

### Configuração de API (Frontend)

No template Next.js, configure a URL da API em `.env`:

```env
NEXT_PUBLIC_API_URL_LOCAL=http://localhost:3000/api/v1
NEXT_PUBLIC_API_URL_PROD=https://api.seudominio.com/api/v1
```

### Fluxo de Autenticação

```
┌──────────┐         Login/Register          ┌──────────┐
│  Next.js │  ─────────────────────────────► │  NestJS  │
│  (Front) │                                 │  (Back)  │
│          │ ◄────────────────────────────── │          │
└──────────┘           JWT Token              └──────────┘
      │                                            │
      │         Requisições Autenticadas           │
      ├────────────────────────────────────────────►
      │           Bearer <token>                   │
      ◄────────────────────────────────────────────┤
```

### Endpoints de Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/register` | Registro |
| GET | `/api/v1/auth/me` | Dados do usuário logado |
| POST | `/api/v1/auth/password/forgot` | Esqueci senha |
| POST | `/api/v1/auth/password/reset` | Reset de senha |
| POST | `/api/v1/auth/password/change` | Trocar senha |

---

## 📁 Estrutura da Stack

```
templates/
├── front-end/
│   └── next/                    # Template Next.js
├── back-end/
│   └── nest/                    # Template NestJS
└── stacks/
    └── nextjs-nestjs/           # Esta documentação
        └── README.md
```

---

## 🏗️ Arquitetura da Stack

### Frontend - Feature-Based

```
front-end/next/src/
├── app/              # Next.js App Router (routes)
├── components/       # Componentes reutilizáveis
├── context/          # Estado global (Context API)
├── hooks/            # Custom hooks
├── layouts/          # Layouts da aplicação
├── models/           # Interfaces e Types
├── routes/           # Configuração de rotas
├── screens/          # Views/Páginas
├── services/         # API services
├── theme/            # Configuração MUI
└── utils/            # Utilitários
```

### Backend - Modular

```
back-end/nest/src/
├── database/         # TypeORM config e migrations
├── helpers/          # Decorators, DTOs compartilhados
├── infrastructure/   # Auth, Authorization, Arquivos
├── modules/          # Features da aplicação
│   ├── base/         # Entidades base
│   └── example/      # CRUD de exemplo
├── app.module.ts
└── main.ts
```

---

## 🔧 Variáveis de Ambiente

### Backend (.env)

```env
# Application
PORT=3000
API_PREFIX=/api/v1

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=api_template_db

# JWT
JWT_SECRET=sua-chave-secreta
JWT_EXPIRES_IN=1d

# Storage (MinIO)
MINIO_HOST=minio
MINIO_PORT=9000
MINIO_BUCKET_NAME=api-template-bucket
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
```

### Frontend (.env)

```env
NODE_ENV=development

# API
NEXT_PUBLIC_API_URL_LOCAL=http://localhost:3000/api/v1
NEXT_PUBLIC_API_URL_PROD=https://api.production.com/api/v1

# Auth
NEXT_PUBLIC_JWT_SECRET=your-secret-key

# Outras integrações
NEXT_PUBLIC_ANALYTICS_ID=
```

---

## ✅ Checklist de Setup

### Backend
- [ ] Copiar template `back-end/nest`
- [ ] Configurar `.env` com credenciais do banco
- [ ] Executar `make up` para subir containers
- [ ] Executar `make migrate` para criar tabelas
- [ ] Verificar documentação Swagger em `/api/docs`
- [ ] Testar login via Swagger

### Frontend
- [ ] Copiar template `front-end/next`
- [ ] Configurar `.env` com URL da API
- [ ] Configurar tema e paleta de cores
- [ ] Configurar rotas em `src/routes/pages.ts`
- [ ] Configurar navegação em `dashboard-config-navigation.tsx`

### Integração
- [ ] Testar login via Frontend
- [ ] Verificar CORS se necessário
- [ ] Testar fluxo completo de autenticação

---

## 📝 Convenções Unificadas

### Separadores

Ambos os templates usam separadores de 60 hífens:

```typescript
// ----------------------------------------------------------------------
```

### Naming Conventions

| Padrão | Frontend | Backend |
|--------|----------|---------|
| Componentes/Classes | `UserCard` | `UserService` |
| Interfaces | `IUser` | `IUser` |
| DTOs | - | `CreateUserDto` |
| Services | `userService` | `UserService` |
| Arquivos | `user-list-view.tsx` | `user.service.ts` |

---

## 📚 Documentação Adicional

- [Next.js Template](../../front-end/next/README.md)
- [Next.js Project Standard](../../front-end/next/PROJECT_STANDARD.md)
- [Next.js Agents Guide](../../front-end/next/AGENTS.md)
- [NestJS Template](../../back-end/nest/README.md)
- [NestJS Project Standard](../../back-end/nest/PROJECT_STANDARD.md)
- [NestJS Agents Guide](../../back-end/nest/AGENTS.md)

---

## 🐛 Troubleshooting

### CORS Errors
Verifique se `FRONTEND_URL` no backend está configurado corretamente.

### JWT Errors
- Verifique se `JWT_SECRET` é igual em ambos os projetos
- Verifique se o token está sendo enviado no header `Authorization: Bearer <token>`

### Database Connection
- Verifique se os containers Docker estão rodando: `make logs`
- Verifique as credenciais no `.env`
- Execute as migrations: `make migrate`

---

**Stack Version:** 1.0  
**Last Updated:** 2026-02-16
