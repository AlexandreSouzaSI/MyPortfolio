# Portfólio — Alexandre Moura

Site pessoal de currículo/portfólio, mostrando projetos reais em produção
(NuGalho Hub, Controle Rota, etc.) com case study de cada um — o problema
que existia, a solução construída e o impacto real — além de um formulário
de contato pra recrutadores.

Segue a mesma arquitetura dos outros projetos: backend NestJS + Prisma +
PostgreSQL e frontend Next.js + Tailwind, como uma API separada do site,
pra dar espaço a crescer (painel de admin, mais seções, etc.) sem precisar
reescrever nada.

## Estrutura

```
backend/               API NestJS (Prisma + PostgreSQL) — projetos e mensagens de contato
frontend/              Site Next.js (App Router) + Tailwind CSS
docker-compose.yml     Stack completo (db + backend + frontend) pra produção
DEPLOY_HOSTINGER.md    Passo a passo de deploy na VPS (Docker + Nginx + HTTPS)
```

## Como rodar localmente

### Banco de dados

Postgres dedicado (separado dos outros bancos do NuGalho/Rota), via Docker:

```bash
docker compose up -d db   # sobe só o banco, na porta 5434 (ver docker-compose.yml)
```

### Backend

`backend/.env` já vem preenchido (DATABASE_URL apontando pro Postgres
acima na porta 5434, e um ADMIN_TOKEN gerado). Só rodar:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed        # popula com os projetos reais (edite prisma/seed.ts)
npm run start:dev         # http://localhost:4100
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev                # http://localhost:3000
```

O site funciona mesmo sem o backend rodando (mostra os projetos de
`lib/fallback-projects.ts`), mas sem backend o formulário de contato cai
no fallback de abrir o e-mail direto.

## Editar conteúdo

- **Dados pessoais / links** (nome, e-mail, GitHub, LinkedIn, WhatsApp, CV): `frontend/lib/site-config.ts`.
- **Currículo em PDF**: coloque o arquivo em `frontend/public/cv/` com o
  nome indicado em `cvUrl` (ver `frontend/public/cv/README.txt`).
- **Prints dos projetos**: coloque em `frontend/public/projects/` com os
  nomes indicados em `frontend/public/projects/README.txt`.
- **Projetos**: `backend/prisma/seed.ts` (rode `npx prisma db seed` de novo
  depois de editar) — ou via API com o `ADMIN_TOKEN`:
  ```bash
  curl -X POST http://localhost:4100/projects \
    -H "Authorization: Bearer SEU_ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ "slug": "novo-projeto", "title": "...", ... }'
  ```
- **Mensagens de contato recebidas**: `GET /contact` com o mesmo header
  `Authorization: Bearer SEU_ADMIN_TOKEN`.

## Deploy (produção)

Stack completo (Postgres + backend + frontend) via Docker Compose — ver
`docker-compose.yml` na raiz e o passo a passo detalhado em
[`DEPLOY_HOSTINGER.md`](./DEPLOY_HOSTINGER.md) pra subir numa VPS com
Nginx + HTTPS, igual ao Controle Rota.

```bash
cp .env.example .env   # preencher POSTGRES_PASSWORD, ADMIN_TOKEN, NEXT_PUBLIC_API_URL
docker compose up -d --build
```

## Próximos passos possíveis

- Painel de admin simples pra editar projetos sem precisar de curl/Postman.
- Mais seções interativas (ex: linha do tempo, blog técnico).
