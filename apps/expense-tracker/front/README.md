# Expense Tracker - Frontend

Aplicação Next.js para controle de despesas.

## 🚀 Como rodar

```bash
# 1. Configurar variáveis de ambiente
cp .env.example .env
# Verifique se NEXT_PUBLIC_API_URL está correto

# 2. Instalar dependências
npm install

# 3. Rodar em desenvolvimento
npm run dev

# Pronto! Acesse http://localhost:8085
```

## 🐳 Docker (opcional)

```bash
# Build da imagem
docker build -t expense-tracker-web .

# Rodar
docker run -p 8085:8085 --env-file .env expense-tracker-web
```

## ⚠️ Pré-requisito

O backend deve estar rodando em http://localhost:3001
