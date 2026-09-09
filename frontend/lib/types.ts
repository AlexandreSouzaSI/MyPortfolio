export type ProjectMetric = {
    label: string;
    value: string;
};

export type Project = {
    id: string;
    slug: string;
    title: string;
    tagline: string;
    problem: string;
    solution: string;
    impact: string;
    techStack: string[];
    liveUrl?: string | null;
    repoUrl?: string | null;
    imageUrl?: string | null;
    // Números de impacto mostrados em destaque (sempre visíveis, sem
    // precisar abrir "Ver detalhes").
    metrics?: ProjectMetric[] | null;
    // Frase curta com o próximo passo do projeto (roadmap).
    nextStep?: string | null;
    // 'in_development' mostra um selo no card avisando que o projeto
    // ainda está sendo construído (ex: Controle Rota).
    status?: 'live' | 'in_development';
    featured: boolean;
    order: number;
};
