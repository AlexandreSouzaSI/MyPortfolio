#!/bin/sh
set -e

echo "Aplicando migrações do Prisma (migrate deploy)..."
npx prisma migrate deploy

# O seed usa upsert (idempotente), então é seguro rodar em toda subida do
# container — só cria/atualiza, nunca duplica.
echo "Rodando seed (idempotente)..."
npx prisma db seed || echo "Seed falhou ou já não é necessário, seguindo."

echo "Iniciando o servidor NestJS..."
exec node dist/src/main.js
