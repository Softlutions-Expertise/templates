# Sistema de Queue para Geração de Filas

Este sistema permite alternar entre processamento síncrono e assíncrono para geração de filas usando Redis.

## Configuração

### Variáveis de Ambiente

```bash
# Modo de operação
QUEUE_MODE=sync # ou 'queue' para usar Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# Para container worker
WORKER_MODE=true
```

### Modo Síncrono (Padrão)

```bash
QUEUE_MODE=sync
```

Processa as filas diretamente na aplicação principal.

### Modo Queue

```bash
QUEUE_MODE=queue
```

Envia jobs para Redis e processa via worker separado.

## Executando

### Desenvolvimento com Docker Compose

```bash
# Modo síncrono (padrão)
docker-compose up api postgres redis

# Modo queue com worker
QUEUE_MODE=queue docker-compose --profile worker up

# Ou usar o arquivo específico
docker-compose -f docker-compose.queue.yml --profile worker up
```

### Produção

```bash
# API em modo queue
docker run -e QUEUE_MODE=queue app:latest

# Worker dedicado
docker run -e WORKER_MODE=true app:latest npm run start:worker
```

### Alternando Modos

1. **Sync para Queue**: Defina `QUEUE_MODE=queue` e suba o worker
2. **Queue para Sync**: Defina `QUEUE_MODE=sync` e pare o worker

## Arquitetura

- **API**: Recebe requests e envia para queue (se habilitado) ou processa diretamente
- **Worker**: Processa jobs da queue em background
- **Redis**: Armazena jobs e estado da queue

## Logs

```bash
# API em modo sync
FilaService#create: (secretaria=X - escola=Y...) - Mode: sync

# API em modo queue
FilaService#create: (secretaria=X - escola=Y...) - Mode: queue
FilaService#create: (secretaria=X - escola=Y...) - Job queued successfully

# Worker
Processing fila generation job: job-id
Fila generation completed for job: job-id
```

## Comandos Úteis

```bash
# Instalar dependências do Redis/Bull
npm install @nestjs/bull bull redis

# Executar apenas API
npm run start:dev

# Executar worker
npm run start:worker

# Ver logs do Redis
docker logs redis

# Limpar queue Redis
docker exec redis redis-cli FLUSHALL
```
