# syntax=docker/dockerfile:1
#
# Build multi-stage do backend NestJS + Prisma (mesmo padrão do Controle
# NF). node:20-bookworm-slim (Debian) em vez de alpine — menos problema de
# compatibilidade glibc com o engine do Prisma.

# ---- deps: instala todas as dependências (precisa das devDependencies pra buildar) ----
FROM node:20-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends python3 make g++ openssl \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json* ./
RUN npm ci

# ---- build: compila o Nest e gera o client do Prisma ----
FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# "prisma generate" só monta o client (não conecta no banco de verdade),
# mas o prisma.config.ts (Prisma 7) exige DATABASE_URL resolvível já pra
# carregar a config nesse estágio de build. O valor de verdade definido no
# docker-compose.yml sobrescreve este em tempo de execução.
ARG DATABASE_URL="postgresql://user:password@localhost:5432/db?schema=public"
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate
RUN npm run build
# Não faz "npm prune --omit=dev" de propósito: o seed (prisma/seed.ts) roda
# via tsx, que é devDependency, e o entrypoint precisa dele em runtime.

# ---- runtime: imagem final, só com o necessário pra rodar ----
FROM node:20-bookworm-slim AS runtime
WORKDIR /app
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home portfolio

ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/package.json ./package.json
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x docker-entrypoint.sh \
    && chown -R portfolio:portfolio /app

USER portfolio

EXPOSE 4100

CMD ["./docker-entrypoint.sh"]
