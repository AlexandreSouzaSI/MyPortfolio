// Conteúdo extraído do currículo/LinkedIn do Alexandre. Editar aqui reflete
// direto nas abas de Experiência e Formação do site (sem precisar de banco
// — isso não é um "projeto" cadastrável, é informação fixa do currículo).

export type ExperienceItem = {
    company: string;
    role: string;
    period: string;
    location: string;
    description: string;
};

export const experience: ExperienceItem[] = [
    {
        company: 'Nu Galho',
        role: 'Desenvolvedor Full Stack',
        period: 'Janeiro de 2025 — atual',
        location: 'Contagem, MG',
        description:
            'Desenvolvimento de sistemas internos e automações com Node.js, Next.js, React, Prisma, C# e Blazor. Construção de painel de gestão de rotas, painel de importação de XML pra informações contábeis e módulo de relatórios, com modelagem de dados via Prisma e integração com APIs externas. Foco em digitalizar e automatizar processos operacionais, reduzindo trabalho manual da equipe.',
    },
    {
        company: 'Kukac',
        role: 'Desenvolvedor Full Stack',
        period: 'Janeiro de 2022 — Dezembro de 2024 (3 anos)',
        location: 'Belo Horizonte, MG',
        description:
            'Desenvolvimento e manutenção de sistemas web full stack com Node.js, React, Docker e PostgreSQL. Participação no ciclo completo: levantamento de requisitos, implementação de APIs REST, integração front-end/back-end e deploy.',
    },
];

export type EducationItem = {
    institution: string;
    degree: string;
    period: string;
};

export const education: EducationItem[] = [
    {
        institution: 'Rocketseat',
        degree: 'MBA em Inteligência Artificial e Automação',
        period: 'Dezembro de 2025 — Dezembro de 2026 (em andamento)',
    },
    {
        institution: 'Rocketseat',
        degree: 'MBA Executivo em Desenvolvimento Web Full Stack',
        period: 'Agosto de 2024 — Agosto de 2025',
    },
    {
        institution: 'Centro Universitário Una',
        degree: 'Bacharelado em Sistemas de Informação',
        period: 'Janeiro de 2015 — Dezembro de 2018',
    },
];

// Todas as certificações são da Rocketseat (Faculdade de Tecnologia) —
// títulos conferidos direto nos PDFs dos certificados.
export const certifications: string[] = [
    'Rocketseat — MBA: Desenvolvimento Back-end',
    'Rocketseat — MBA: Desenvolvimento Web Front-end',
    'Rocketseat — MBA: Desenvolvimento Mobile',
    'Rocketseat — MBA: Fundamentos do Desenvolvimento Web',
    'Rocketseat — MBA: Soft Skills do Profissional Full Stack',
    'Rocketseat — Formação em Node.js',
    'Rocketseat — Fundamentos do Node.js',
    'Rocketseat — NestJS',
    'Rocketseat — DDD no Node.js',
];

export const topSkills: string[] = [
    'Node.js',
    'NestJS',
    'Next.js',
    'React',
    'TypeScript',
    'Java',
    'C#',
    'Prisma ORM',
    'PostgreSQL',
    'Docker',
    'Blazor',
    'Tailwind CSS',
    'REST APIs',
];
