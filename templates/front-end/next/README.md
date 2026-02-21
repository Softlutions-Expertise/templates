# CINELASER APP INPLACE

Sistema de gestão das unidades

## ▶️ Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento ou teste.

### 📋 Pré-requisitos

Para rodar o projeto você deve ter no mínimo os seguintes requisitos

```
Node: 22.20.0 ou verão mais atual LTS
npm: 10.9.2 ou verão mais atual LTS
```

## 📦 Implantação

Para finalizar a implantação, realize este último passoa passo

Node e npm:

- Vá até raiz do projeto e digite os seguintes comando

```
npm install
npm run dev
```

Este comando ira installar todas as dependências do Node e iniciar o projeto, a porta padrão é 8084.

## 🚀 Build

Está etapa é feita apenas caso você queira buildar e testar em modo de procução a aplicação

Npm :

- Crie uma nova pasta e dentro dela coloque os seguintes arquivos do projeto de Implantação

  - package.json \*arquivo
  - public \*diretório
  - package-lock.json \*arquivo

- Depois execute este comando

```
npm ci
npm build
```

Este comando ira installar todas as dependências do Node e iniciar o projeto em modo de produção
