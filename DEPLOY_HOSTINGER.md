# Deploy na VPS (Hostinger) — Portfólio

Guia passo a passo pra subir o portfólio (backend + frontend + Postgres)
na mesma VPS onde já rodam o NuGalho Hub e o Controle Rota, usando Docker +
Nginx + HTTPS. Siga na ordem e teste cada etapa antes de ir pra próxima.

## 0. Prep: escolha dos subdomínios

Você vai precisar de 2 subdomínios apontando pro IP da VPS (registro DNS
tipo A), por exemplo:

- `portfolio.amsx.online` → frontend (site)
- `portfolio-api.amsx.online` → backend (API)

Crie os dois registros DNS antes de continuar (pode levar alguns minutos
pra propagar).

## 1. Enviar o projeto pra VPS

Se o repositório já está no GitHub (`AlexandreSouzaSI/MyPortfolio`), o
jeito mais simples é clonar direto na VPS:

```bash
ssh seu_usuario@SEU_IP_DA_VPS
cd /opt   # ou a pasta onde os outros projetos ficam
git clone https://github.com/AlexandreSouzaSI/MyPortfolio.git portfolio
cd portfolio
```

## 2. Configurar variáveis de ambiente

Na raiz do projeto, na VPS:

```bash
cp .env.example .env
nano .env
```

Preencha:

- `POSTGRES_PASSWORD` — uma senha forte (ex: `openssl rand -hex 16`).
- `ADMIN_TOKEN` — mesmo valor que você quer usar pra proteger a API (ex:
  `openssl rand -hex 32`).
- `NEXT_PUBLIC_API_URL` — a URL pública da API, ex:
  `https://portfolio-api.amsx.online` (sem barra no final).

Esse `NEXT_PUBLIC_API_URL` fica "gravado" dentro do build do frontend, então
se você mudar depois precisa rodar `docker compose up -d --build frontend`
de novo.

## 3. Subir os containers

```bash
docker compose up -d --build
docker compose ps        # os 3 (db, backend, frontend) devem estar "Up"
docker compose logs -f backend   # confirma que migrou e "Servidor rodando na porta 4100"
```

O backend já roda `prisma migrate deploy` e `prisma db seed` automaticamente
ao subir (via `docker-entrypoint.sh`) — não precisa rodar nada manual.

Nesse ponto o site já responde localmente na VPS:

```bash
curl http://127.0.0.1:3010          # frontend
curl http://127.0.0.1:4100/projects # backend
```

## 4. Nginx — reverse proxy

Instale o Nginx se ainda não tiver (`apt install nginx`) e crie dois
arquivos de site (ajuste os domínios):

`/etc/nginx/sites-available/portfolio-frontend`:

```nginx
server {
    listen 80;
    server_name portfolio.amsx.online;

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`/etc/nginx/sites-available/portfolio-api`:

```nginx
server {
    listen 80;
    server_name portfolio-api.amsx.online;

    location / {
        proxy_pass http://127.0.0.1:4100;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ativar e recarregar:

```bash
ln -s /etc/nginx/sites-available/portfolio-frontend /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/portfolio-api /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

Teste sem HTTPS ainda: `http://portfolio.amsx.online` e
`http://portfolio-api.amsx.online/projects` devem responder.

## 5. HTTPS com Certbot

```bash
apt install certbot python3-certbot-nginx   # se ainda não tiver
certbot --nginx -d portfolio.amsx.online -d portfolio-api.amsx.online
```

O Certbot edita os arquivos do Nginx automaticamente pra redirecionar
80 → 443 e renova sozinho (cron/systemd timer já vem configurado no pacote).

## 6. Checklist final

- [ ] `https://portfolio.amsx.online` abre o site.
- [ ] `https://portfolio-api.amsx.online/projects` retorna os projetos em JSON.
- [ ] Formulário de contato envia sem erro.
- [ ] Botões WhatsApp / Baixar CV / GitHub / LinkedIn abrem certo.
- [ ] `docker compose logs -f` sem erros recorrentes.

## Atualizações futuras

Depois de qualquer alteração no código, pra atualizar em produção:

```bash
cd /opt/portfolio
git pull
docker compose up -d --build
```

Isso reconstrói só o que mudou e reaplica migrações do Prisma
automaticamente (idempotente, seguro rodar sempre).
