#!/bin/sh
set -e

echo "⏳ Aguardando PostgreSQL ficar disponível..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done
echo "✅ PostgreSQL pronto!"

echo "📦 Rodando migrações..."
npm run migration:up:prod

echo "🚀 Iniciando aplicação..."
exec "$@"
