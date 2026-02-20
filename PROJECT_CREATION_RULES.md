# 🚨 Regras de Criação de Projetos

> **Leia antes de criar qualquer novo projeto!**

Estas regras são **OBRIGATÓRIAS** para garantir consistência, manutenibilidade e facilitar o trabalho da equipe.

---

## 📋 Regra 1: SEMPRE Copiar Templates

### ❌ PROIBIDO

Criar arquivos de configuração do zero:
- `package.json`
- `tsconfig.json`
- `docker-compose.yml`
- `.eslintrc.js` / `.eslintrc.json`
- `prettier.config.js` / `.prettierrc`
- `next.config.js`
- `nest-cli.json`

### ✅ OBRIGATÓRIO

Copiar do template base e adaptar **apenas o necessário**:

```bash
# Backend NestJS
cp -r templates/back-end/nest meu-projeto/back

# Frontend Next.js  
cp -r templates/front-end/next meu-projeto/front
```

### ✏️ O que pode ser alterado

| Arquivo | Pode alterar | NÃO alterar |
|---------|--------------|-------------|
| `package.json` | `name`, `description` | Dependências, scripts, versões |
| `.env.example` | Valores de exemplo | Nomes das variáveis obrigatórias |
| `docker-compose.yml` | Nome do serviço/banco | Estrutura, versões de imagens |
| `README.md` | Tudo (documentação específica) | - |

---

## 🐳 Regra 2: Containerização Obrigatória

### Backend (OBRIGATÓRIO)

Todo projeto backend DEVE ter containerização completa:

1. **`Dockerfile`** para a aplicação:
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

2. **`docker-compose.yml`** com PostgreSQL E API:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: meu-projeto-db
    environment:
      POSTGRES_USER: ${DB_USERNAME:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_DATABASE:-meu_projeto}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: meu-projeto-api
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: postgres  # Nome do serviço!
      DB_PORT: 5432
      DB_USERNAME: ${DB_USERNAME:-postgres}
      DB_PASSWORD: ${DB_PASSWORD:-postgres}
      DB_DATABASE: ${DB_DATABASE:-meu_projeto}
      JWT_SECRET: ${JWT_SECRET:-change-me}
    ports:
      - "${API_PORT:-3001}:3000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

⚠️ **IMPORTANTE:** O `docker-compose.yml` deve subir tanto o **banco quanto a API**. Não apenas o banco!

3. **`.env.example`** completo:
```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=meu_projeto

# JWT
JWT_SECRET=change-this-secret-key
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:8085
```

### Frontend (RECOMENDADO)

Para projetos fullstack ou com deploy:
- `.env.example` com URL da API
- `Dockerfile` para build de produção

---

## ✅ Regra 3: Checklist de Criação

Antes de considerar um projeto "pronto para desenvolvimento":

### Setup Inicial
- [ ] Copiado template base (não criado do zero)
- [ ] Alterado apenas `name` no package.json
- [ ] Criado `.env.example` com todas as variáveis necessárias
- [ ] Criado `.env` local (não versionado)
- [ ] Adicionado `.env` no `.gitignore`

### Containerização
- [ ] `Dockerfile` da aplicação criado
- [ ] `docker-compose.yml` com PostgreSQL **E** serviço da API
- [ ] Ambos sobem com `docker-compose up -d` (não só o banco!)
- [ ] API conecta ao banco pelo nome do serviço

### Banco de Dados
- [ ] TypeORM configurado
- [ ] Migrations configuradas
- [ ] Executado `npm run migration:up` sem erros
- [ ] Tabelas criadas no banco

### Testes
- [ ] Aplicação inicia sem erros (`npm run start:dev`)
- [ ] Swagger/docs acessível (backend)
- [ ] Healthcheck/resposta básica funciona

### Documentação
- [ ] README.md criado com:
  - Descrição do projeto
  - Stack utilizada
  - Como rodar (passo a passo)
  - Variáveis de ambiente necessárias

---

## 📁 Estrutura Esperada

Após copiar template e fazer setup:

```
meu-projeto/
├── back/                       # Copiado de templates/back-end/nest
│   ├── src/
│   ├── docker-compose.yml      # PostgreSQL container
│   ├── Dockerfile              # App container
│   ├── .env.example            # Variáveis documentadas
│   ├── .env                    # NÃO versionar
│   ├── package.json            # Nome alterado, resto igual
│   └── README.md               # Documentação específica
│
├── front/                      # Copiado de templates/front-end/next
│   ├── src/
│   ├── .env.example            # URL da API
│   ├── .env                    # NÃO versionar
│   ├── package.json            # Nome alterado, resto igual
│   └── README.md               # Documentação específica
│
└── README.md                   # Documentação geral do projeto
```

---

## 🎯 Exemplo Completo

### Criando novo projeto:

```bash
# 1. Criar pasta do projeto
mkdir meu-app && cd meu-app

# 2. Copiar templates (NUNCA criar do zero!)
cp -r /caminho/templates/back-end/nest back
cp -r /caminho/templates/front-end/next front

# 3. Configurar Backend
cd back

# Editar package.json - apenas name e description
# "name": "meu-app-api",
# "description": "API do Meu App"

# Criar .env
cp .env.example .env
# Editar .env com suas configurações

# Subir banco
docker-compose up -d

# Instalar e rodar
npm install
npm run migration:up
npm run start:dev

# 4. Configurar Frontend (outro terminal)
cd ../front

# Editar package.json - apenas name
# "name": "meu-app-web"

# Criar .env
cp .env.example .env
# Editar NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Instalar e rodar
npm install
npm run dev
```

---

## ⚠️ Consequências de Não Seguir

Se criar do zero ou ignorar estas regras:
- ❌ Configurações inconsistentes entre projetos
- ❌ Problemas de integração com outros serviços
- ❌ Dificuldade de manutenção
- ❌ Onboarding mais lento de novos devs
- ❌ Bugs difíceis de debugar por causa de diferenças sutis de config

---

## 🆘 Quando posso criar do zero?

**RARAMENTE!** Apenas quando:
- O template não atende necessidades técnicas específicas
- Projeto experimental/teste que será descartado
- Framework/versão completamente diferente

**Mesmo assim, consulte antes!**

---

## 📚 Recursos

- [NestJS Template](./back-end/nest/)
- [Next.js Template](./front-end/next/)
- [Stack Next.js + NestJS](./stacks/nextjs-nestjs/)

---

**Última atualização:** 2026-02-16  
**Versão:** 1.0
