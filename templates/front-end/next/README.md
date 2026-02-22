# Template Frontend - Next.js

Template frontend em Next.js 13+ com TypeScript, Material UI e integração com backend NestJS.

## 🚀 Começando

### Pré-requisitos

- Node.js >= 18.0.0
- npm ou yarn
- Backend NestJS rodando (porta 3000)

### Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local conforme necessário
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento (porta 3000)
npm run dev

# Com limpeza de cache
npm run dev:clean
```

O frontend estará disponível em `http://localhost:3000`

### Build

```bash
# Build de produção
npm run build

# Iniciar em produção
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Área logada
│   │   └── pessoa/        # Módulo de pessoas
│   │       └── colaborador/  # CRUD de colaboradores
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
├── hooks/                 # Custom hooks
├── models/                # Interfaces TypeScript
├── services/              # Serviços de API
├── stores/                # Estado global (Zustand)
├── theme/                 # Configuração do Material UI
└── utils/                 # Utilitários
```

## 🔌 Integração com Backend

O frontend se comunica com o backend NestJS nas seguintes rotas:

| Endpoint | Descrição |
|----------|-----------|
| `POST /api/auth/login` | Login com JWT |
| `POST /api/auth/refresh` | Refresh token |
| `GET /api/pessoas/colaboradores` | Listar colaboradores |
| `POST /api/pessoas/colaboradores` | Criar colaborador |
| `PUT /api/pessoas/colaboradores/:id` | Atualizar colaborador |
| `DELETE /api/pessoas/colaboradores/:id` | Remover colaborador |

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Modo de autenticação
NEXT_PUBLIC_AUTH_MODE=jwt

# Serviço de relatórios
NEXT_PUBLIC_REPORT_SERVICE_URL=http://localhost:3000/api
```

## 🛠️ Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Desenvolvimento com hot reload |
| `npm run dev:clean` | Limpa cache e inicia dev |
| `npm run build` | Build de produção |
| `npm start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint |
| `npm run prettier` | Formata código com Prettier |
| `npm run type-check` | Verificação de tipos TypeScript |
| `npm run clean` | Remove node_modules e builds |

## 📝 Convenções

- **Componentes**: PascalCase (ex: `UserForm.tsx`)
- **Hooks**: camelCase com prefixo `use` (ex: `useAuth.ts`)
- **Serviços**: camelCase com sufixo `Service` (ex: `colaboradorService.ts`)
- **Modelos**: Interfaces com prefixo `I` (ex: `IColaborador`)

## 🔒 Autenticação

O template suporta dois modos de autenticação:

1. **JWT** (padrão): Login com username/password
2. **GovBR**: Integração com login gov.br (quando configurado)

O token é armazenado no `localStorage` e automaticamente incluído nas requisições via interceptor Axios.

## 📄 Licença

MIT
