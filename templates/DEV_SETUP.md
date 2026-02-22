# Guia de Setup - Desenvolvimento Local

Guia completo para rodar o backend (NestJS) e frontend (Next.js) localmente.

## 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** ou **yarn**
- **Docker** e **Docker Compose** (para infraestrutura)

## 🐳 Infraestrutura (Docker)

Toda a infraestrutura (PostgreSQL, Redis, MinIO) está containerizada.

### Comandos Make (recomendado)

```bash
# Sobe todos os containers
make up

# Ver status
make status

# Acessar PostgreSQL
make psql

# Acessar Redis
make redis-cli

# Ver logs
make logs

# Derrubar containers
make down

# Derrubar e apagar dados (CUIDADO!)
make down-v
```

### Comandos Docker Compose (alternativo)

```bash
# Subir containers
docker-compose -f docker-compose.dev.yml up -d

# Derrubar containers
docker-compose -f docker-compose.dev.yml down

# Derrubar e apagar volumes (CUIDADO!)
docker-compose -f docker-compose.dev.yml down -v
```

### Serviços e Portas

| Serviço | Porta Host | Porta Container | Acesso |
|---------|------------|-----------------|--------|
| PostgreSQL | 5432 | 5432 | localhost:5432 |
| Redis | 6379 | 6379 | localhost:6379 |
| MinIO API | 9002 | 9000 | localhost:9002 |
| MinIO Console | 9003 | 9001 | http://localhost:9003 |

**Credenciais:**
- PostgreSQL: `postgres` / `postgres` (database: `template_db`)
- MinIO: `minioadmin` / `minioadmin`

## 🔧 Backend (NestJS)

```bash
cd templates/back-end/nest

# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env conforme necessário

# O .env já vem configurado para conectar nos containers Docker:
# DB_HOST=localhost
# DB_PORT=5432
# REDIS_HOST=localhost
# REDIS_PORT=6379
# MINIO_ENDPOINT=localhost
# MINIO_PORT=9002

# 3. Rodar migrações
npm run migration:up

# 4. Criar usuário admin (opcional)
npx ts-node src/scripts/seed-admin.ts

# 5. Iniciar servidor de desenvolvimento
npm run start:dev
```

Backend disponível em `http://localhost:3000`
Documentação Swagger: `http://localhost:3000/api/docs`

## 💻 Frontend (Next.js)

```bash
cd templates/front-end/next

# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.local.example .env.local

# Exemplo de .env.local:
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3000/api
API_URL=http://localhost:3000/api
NEXT_PUBLIC_AUTH_MODE=jwt
NEXT_PUBLIC_REPORT_SERVICE_URL=http://localhost:3000/api
EOF

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

Frontend disponível em `http://localhost:3001`

## 🧪 Testando a Aplicação

### 1. Verificar se o backend está rodando

```bash
curl http://localhost:3000/api/health
# Resposta esperada: {"status":"ok"}
```

### 2. Fazer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 3. Acessar o frontend

Abra `http://localhost:3001` no navegador e faça login com:
- Username: `admin`
- Password: `admin123`

## 🔄 Comandos Úteis

### Backend

```bash
# Desenvolvimento com hot reload
npm run start:dev

# Build de produção
npm run build

# Rodar em produção
npm run start:prod

# Criar nova migração vazia
npm run migration:create -- src/database/migrations/nome-migracao

# Gerar migração automaticamente
npm run migration:generate -- src/database/migrations/nome-migracao

# Rodar migrações
npm run migration:up

# Reverter última migração
npm run migration:down
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar em produção
npm start

# Verificação de tipos
npm run type-check

# Lint
npm run lint

# Formatar código
npm run prettier
```

## 🛠️ Solução de Problemas

### Erro de conexão com PostgreSQL

```bash
# Verificar se o container está rodando
make status

# Ver logs do PostgreSQL
docker logs template-postgres

# Reiniciar containers
make down && make up
```

### Erro "Cannot find module"

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Porta já em uso

```bash
# Encontrar processo usando a porta
lsof -i :3000  # backend
lsof -i :3001  # frontend
lsof -i :5432  # postgres

# Matar processo
kill -9 <PID>
```

### Migrações falhando

```bash
# Reset completo (CUIDADO: apaga todos os dados!)
make down-v
make up
npm run migration:up
```

## 📁 Estrutura de Pastas

```
templates/
├── docker-compose.dev.yml   # Infraestrutura Docker
├── Makefile                 # Comandos helper
├── DEV_SETUP.md            # Este arquivo
│
├── back-end/
│   └── nest/              # Backend NestJS
│       ├── src/
│       │   ├── modules/
│       │   │   └── pessoa/colaborador/
│       │   └── database/
│       │       └── migrations/
│       └── package.json
│
└── front-end/
    └── next/              # Frontend Next.js
        ├── src/
        │   ├── app/
        │   ├── services/
        │   └── models/
        └── package.json
```

## 🔐 Credenciais Padrão

| Usuário | Senha | Nível de Acesso |
|---------|-------|-----------------|
| admin   | admin123 | Administrador |

## 📝 Notas Importantes

1. **Nunca commite arquivos `.env`** - eles contêm segredos
2. **Mude a senha do admin** em produção
3. **Use HTTPS** em produção (configure um reverse proxy)
4. **Backup do banco** regularmente em produção

---

Para mais informações, consulte:
- [Backend README](back-end/nest/README.md)
- [Frontend README](front-end/next/README.md)
