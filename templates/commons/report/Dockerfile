# cópia de oven/bun:1.2.23-debian
FROM docker://default-route-openshift-image-registry.apps.ocpntx.defensoria.ro.def.br/openshift-operators/bun:1.2.23-debian AS base

ARG BAIXAR_ENV_GITLAB_API=false
ARG GITLAB_URL
ARG GITLAB_PROJECT_ID
ARG GITLAB_API_TOKEN
ARG BUILD_ENV_SLUG

WORKDIR /app

ENV BUN_INSTALL_CACHE_DIR=/bun/cache
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"
ENV PUPPETEER_SKIP_DOWNLOAD="true"

# Atualiza os pacotes e instala Chromium + dependências do Puppeteer
RUN apt-get update \
    && apt-get install -y \
    chromium \
    libgbm-dev \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxrandr2 \
    xdg-utils \
    libnss3 \
    libnspr4 \
    libx11-xcb1 \
    libxdamage1 \
    libxfixes3 \
    libxrender1 \
    ca-certificates \
    fonts-ipafont \
    curl \
    jq \
    --no-install-recommends;

RUN rm -rf /var/lib/apt/lists/*;

FROM base AS dev-dependencies
ARG BAIXAR_ENV_GITLAB_API=false
ARG GITLAB_URL
ARG GITLAB_PROJECT_ID
ARG GITLAB_API_TOKEN
ARG BUILD_ENV_SLUG
ENV NODE_OPTIONS="--max-old-space-size=1024"

COPY package.json bun.lock ./

RUN if [ "$BAIXAR_ENV_GITLAB_API" = "false" ]; then \
        echo "AVISO: Baixando ENVs da API do GitLab desativado (BAIXAR_ENV_GITLAB_API=false)."; \
        echo "Presume-se que o .env já existe no contexto do build, ou que não é necessário."; \
    else \
        # --- LÓGICA DE DOWNLOAD ATIVA (BAIXAR_ENV_GITLAB_API = true) --- \
        echo "Iniciando download dinâmico de ENVs do GitLab via API..."; \
        \
        # 1. VALIDAÇÃO DE PARÂMETROS CRÍTICOS \
        if [ -z "$GITLAB_URL" ] || [ -z "$GITLAB_PROJECT_ID" ] || [ -z "$GITLAB_API_TOKEN" ]; then \
            echo "ERRO: Parâmetros de API incompletos. Não é possível baixar ENVs dinamicamente."; \
            echo "Verifique se GITLAB_URL, GITLAB_PROJECT_ID e GITLAB_API_TOKEN foram passados via --build-arg."; \
            exit 1; \
        fi; \
        \
        # 2. VERIFICAÇÃO DE AUTENTICAÇÃO DO TOKEN
        echo "Verificando autenticação do token na API..."; \
        AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
            --header "PRIVATE-TOKEN: ${GITLAB_API_TOKEN}" "${GITLAB_URL}/projects/${GITLAB_PROJECT_ID}/variables?per_page=100"); \
        \
        if [ "$AUTH_STATUS" != "200" ]; then \
            echo "ERRO: O token da API do GitLab está inválido ou expirado (Status: $AUTH_STATUS)."; \
            echo "Verifique a variável GITLAB_API_TOKEN no seu CI/CD."; \
            exit 1; \
        fi; \
        \
        set -ex; \
        echo "Token válido. Baixando variáveis..."; \
        \
        # 3. Execução do Bloco de API \
        API_RESPONSE=$(curl -s --header "PRIVATE-TOKEN: ${GITLAB_API_TOKEN}" "${GITLAB_URL}/projects/${GITLAB_PROJECT_ID}/variables?per_page=100"); \
        \
        # Filtra o JSON e cria o .env
        (echo "$API_RESPONSE" | tr -d '\n\r' | jq -r --arg ENV_SCOPE "$BUILD_ENV_SLUG" '.[] | \
            select((.key | test("^(CI_|FF_|GITLAB_|OPENSHIFT_|KUBERNETES_)") | not) and \
                   (.environment_scope == "*" or .environment_scope == $ENV_SCOPE)) | \
            "\(.key)=\(.value)"' > /app/.env) 2>/dev/null; \
        \
        # 4. Verificação de Sucesso
        if [ ! -s /app/.env ]; then \
            echo "Erro: O arquivo .env está vazio ou a chamada de API falhou." >&2; \
            exit 1; \
        fi; \
        \
    fi

# Instala as dependências do projeto
RUN bun install --frozen-lockfile

FROM dev-dependencies AS runtime

# Copia todos os arquivos do projeto para dentro do contêiner
COPY . .


# Expõe a porta usada pelo servidor
ENV PORT=3003
EXPOSE 3003

# Comando para iniciar o servidor
CMD ["bun", "run", "start"]