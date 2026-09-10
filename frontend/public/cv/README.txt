Não precisa colocar nada aqui manualmente.

O PDF do currículo (alexandre-moura-de-souza.pdf) é gerado automaticamente
antes de cada build ("npm run prebuild" → scripts/generate-cv.ts), a partir
dos dados de lib/resume.ts e lib/site-config.ts. Editar o currículo é editar
esses dois arquivos — o PDF se atualiza sozinho no próximo build/deploy.

O .pdf gerado aqui não é commitado (está no .gitignore) porque é sempre
recriado no build.

FOTO (opcional): pra aparecer sua foto no círculo do cabeçalho do CV,
coloque um arquivo chamado exatamente "photo.jpg", "photo.jpeg" ou
"photo.png" nesta mesma pasta (public/cv/). Se não existir nenhum desses
arquivos, o círculo fica como espaço reservado (tracejado), sem quebrar
nada. Diferente do PDF, o arquivo de foto NÃO está no .gitignore — comite
normalmente (git add -A) e ele vai junto no push/deploy.
