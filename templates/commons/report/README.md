# reporter-service

Obtenha o código-fonte deste projeto:

```bash
git clone https://gitlab.defensoria.ro.def.br/ifro/central-de-vagas/back-end/reporter-service.git
```

Em seguida, crie um `.env` com base no `.env.example`.

```bash
cp .env.example .env
```

## Rodar com o Docker

Para inciar:

```bash
make up
```

Veja: <http://localhost:3003/>

Para desligar:

```bash
make down
```

Para parar:

```bash
make stop
```

## Rodar nativo

```bash
bun install
```

```bash
bun start
```

Veja: <http://localhost:3003/>
