import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Projetos reais, já rodando em produção pros estabelecimentos do Alexandre.
// Editar aqui e rodar "npx prisma db seed" de novo atualiza (upsert por
// slug) sem duplicar. Pra adicionar um projeto novo (ex: Captura Notas),
// basta copiar um bloco abaixo com um slug novo.
const projects = [
    {
        slug: 'nugalho-hub',
        title: 'NuGalho Hub',
        tagline:
            'Central de operação fiscal e de tarefas pra bares/restaurantes — tirando processos essenciais do WhatsApp',
        problem:
            'Antes, tudo era resolvido por WhatsApp — demora na comunicação, falha nos processos, processos travados sem solução nem evolução. Não existia nenhum sistema (contratado ou gratuito) que emitisse NF de Perda de mercadoria, e montar isso na mão exigiria uma equipe que o time reduzido não tinha; o controle das notas fiscais era feito mandando XML e foto por WhatsApp direto pra contabilidade, sem organização, dificultando a apuração de imposto; não havia visibilidade do que realmente chegava em cada bar — o que foi recebido e o que ainda estava pendente; tarefas do dia a dia se perdiam em conversa de grupo, sem cobrança nem notificação; e contas a pagar e conciliação bancária eram feitas manualmente, sem cruzamento automático com o extrato.',
        solution:
            'A validação de cada etapa foi feita direto com o proprietário dos estabelecimentos, com autonomia pra implantar os processos e conversar com a equipe — garantindo que cada mudança resolvesse o problema de verdade, não só no papel. Construí um sistema web (NestJS + PostgreSQL + Next.js) organizado em 5 frentes: emissão de NF de Perda de mercadoria — processo que nenhum sistema do mercado oferecia — direto pelo app; central de Notas Fiscais que substitui o envio manual por WhatsApp, deixando as notas organizadas e prontas pra apuração de imposto pela contabilidade; controle de NF de Entrada, mostrando o que chegou, o que está pendente e onde houve divergência no recebimento de cada bar; um quadro de Tarefas estilo Trello com notificação pra quem está envolvido; e uma aba de Contas a Pagar com conciliação bancária automática por importação de extrato OFX.',
        impact:
            'Hoje os processos rodam de forma organizada: quando algo falha, sabemos exatamente onde e quem, e vamos direto no problema em vez de procurar em mensagens perdidas. Documentos deixaram de depender de alguém lembrar de enviar por WhatsApp e passaram a ser captados em tempo real. A nota de perda, que era algo extremamente necessário e não existia em nenhum sistema, agora é emitida de forma simples. Somando as notas de serviço (70/mês na loja principal, média de 30/mês nas demais) e de entrada (240/mês na principal, média de 120/mês nas demais), o sistema processa hoje cerca de 130 NF de serviço e 480 NF de entrada por mês.',
        metrics: [
            { label: 'Lojas ativas', value: '3' },
            { label: 'Usuários (adm, gerentes, proprietário)', value: '~20' },
            { label: 'NF de serviço / mês', value: '~130' },
            { label: 'NF de entrada / mês', value: '~480' },
        ],
        nextStep: 'Próximo passo: módulo de controle de estoque.',
        techStack: [
            'NestJS',
            'Prisma',
            'PostgreSQL',
            'Next.js',
            'React',
            'TypeScript',
            'Tailwind CSS',
            'PWA',
        ],
        imageUrl: '/projects/nugalho-hub.png',
        liveUrl: 'https://nugalhohub.amsx.online/',
        status: 'live',
        featured: true,
        order: 1,
    },
    {
        slug: 'controle-rota',
        title: 'Controle Rota',
        tagline:
            'Rastreamento e controle de viagens da frota de caminhões (em desenvolvimento ativo)',
        problem:
            'Não havia visibilidade de onde cada caminhão estava, quanto tempo ficava parado em cada ponto (carga, descarga, estadia) nem histórico de rotas — informação que só existia de forma dispersa nos rastreadores de cada veículo.',
        solution:
            'Estou validando cada funcionalidade direto com o proprietário da transportadora antes de construir. Hoje o sistema controla 8 caminhões, com integração à API dos rastreadores captando posição e km/h em tempo real, análise de quantas viagens estão acontecendo e quantas foram feitas por período, e controle de caminhões parados.',
        impact:
            'Já roda em produção dando visibilidade operacional da frota — 8 caminhões rastreados em tempo real — e segue em desenvolvimento ativo.',
        metrics: [
            { label: 'Caminhões monitorados', value: '8' },
            { label: 'Rastreamento', value: 'Tempo real (posição + km/h)' },
        ],
        nextStep:
            'Próximo passo: acesso à API de documentação de viagens e gastos, módulo fiscal (receitas e despesas) e monitoramento de origem/destino com % de progresso por viagem e por caminhão — a ideia é virar um sistema da própria empresa, com mais visibilidade e valor agregado pra clientes e futuros clientes.',
        techStack: [
            'NestJS',
            'Prisma',
            'PostgreSQL',
            'React',
            'Leaflet',
            'TypeScript',
        ],
        imageUrl: '/projects/controle-rota.png',
        liveUrl: 'https://controlerota.amsx.online/',
        status: 'in_development',
        featured: true,
        order: 2,
    },
];

async function main() {
    for (const project of projects) {
        await prisma.project.upsert({
            where: { slug: project.slug },
            update: project,
            create: project,
        });
    }

    console.log(`Seed concluído: ${projects.length} projeto(s).`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
