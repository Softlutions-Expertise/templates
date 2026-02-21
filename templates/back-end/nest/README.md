# Microserviço Fila de espera 

....
## Dependência
Docker e docker-compose

## Instalação em Ambiente de desenvolvimento:
Por padrão o microsserviço inicializará na porta _3002_
```bash
cp .env-example .env

node --loader ts-node/esm 
 
npm install

make up 
```
### Executar migrations
```bash
docker exec -it api-fila-espera npm run migration:up
```

### Log da aplicação
```bash
make logs
```

## Instalação sem docker

```bash
cp .env-example .env

$ npm install
```

## Executar app

```bash
# development - watch mode
$ npm run start:dev

# development
$ npm run start

# production mode
$ npm run start:prod
```

## Testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## TypeORM - Migration create
Para gerar arquivos de migração é necessário adicionar o caminho completo da pasta, conforme
exemplo abaixo.
```bash
npm run migration:create src/database/migrations/create_nome_tabela_table
```

## TypeORM - Executar migrations
```bash
npm run migration:up
```

## TypeORM - Entity create
Para gerar arquivos de entidade (entity) é necessário adicionar o caminho completo da pasta, conforme
exemplo abaixo. O nome do arquivo de entidade deverá conforme o exemplo: serie.entity.ts

Nome da classe: export class Serie { ... }
```bash
npm run typeorm:create src/modules/nome_module/entities/NomeEntity
```
## Auth Localmente

Utilizar CPF de um funcionario cadastrado:

`Authorization: Bearer mock.cpf.00000000000` 

NOTA: Só funciona caso configurado com `ENABLE_MOCK_ACESS_TOKEN=true`.

## Time de desenvolvimento
Ádrian Henrique
Danilo Saiter
Gabriel Antunes
Iury França
Priscila Teodoro
Walisson Machado

