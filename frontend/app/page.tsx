'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Building2, Download, GraduationCap, Mail } from 'lucide-react';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/site-config';
import { fallbackProjects } from '@/lib/fallback-projects';
import type { Project } from '@/lib/types';
import { ProjectCard } from '../src/components/ProjectCard';
import { GithubIcon, LinkedinIcon, WhatsappIcon } from '../src/components/icons';
import { ThemeToggle } from '../src/components/ThemeToggle';
import { ExperienceSection } from '../src/components/ExperienceSection';
import { EducationSection } from '../src/components/EducationSection';

type TabKey = 'projetos' | 'experiencia' | 'formacao';

const tabs: { key: TabKey; label: string; icon: typeof Briefcase }[] = [
    { key: 'projetos', label: 'Projetos', icon: Briefcase },
    { key: 'experiencia', label: 'Experiência', icon: Building2 },
    { key: 'formacao', label: 'Formação', icon: GraduationCap },
];

export default function Home() {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-zinc-500">Carregando...</div>}>
            <HomeInner />
        </Suspense>
    );
}

function HomeInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestedTab = searchParams.get('tab') as TabKey | null;

    const [activeTab, setActiveTab] = useState<TabKey>(() =>
        tabs.some((tab) => tab.key === requestedTab) ? (requestedTab as TabKey) : 'projetos',
    );

    const [projects, setProjects] = useState<Project[]>(fallbackProjects);

    useEffect(() => {
        api
            .get<Project[]>('/projects')
            .then((res) => {
                if (res.data?.length) setProjects(res.data);
            })
            .catch(() => {
                // Backend fora do ar — mantém o fallback estático, o site
                // continua funcionando normalmente.
            });
    }, []);

    useEffect(() => {
        router.replace(`/?tab=${activeTab}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    return (
        <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 space-y-10">
            <ThemeToggle />

            <section className="space-y-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                    {siteConfig.role}
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                    {siteConfig.name}
                </h1>
                <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
                    {siteConfig.pitch}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                    <a
                        href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        <WhatsappIcon size={16} />
                        WhatsApp
                    </a>
                    <a
                        href={`mailto:${siteConfig.email}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        <Mail size={16} />
                        Email
                    </a>
                    <a
                        href={siteConfig.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        <GithubIcon size={16} />
                        GitHub
                    </a>
                    <a
                        href={siteConfig.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        <LinkedinIcon size={16} />
                        LinkedIn
                    </a>
                    <a
                        href={siteConfig.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        <Download size={16} />
                        Baixar CV
                    </a>
                </div>
            </section>

            <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${isActive
                                ? 'bg-indigo-600 text-white'
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === 'projetos' && (
                <section className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold">Projetos</h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Sistemas construídos do zero e em uso real — não
                            protótipos.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {projects.map((project) => (
                            <ProjectCard key={project.slug} project={project} />
                        ))}
                    </div>
                </section>
            )}

            {activeTab === 'experiencia' && (
                <section className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold">Experiência</h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Mais de 3 anos construindo sistemas web pra empresas.
                        </p>
                    </div>

                    <ExperienceSection />
                </section>
            )}

            {activeTab === 'formacao' && (
                <section className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold">Formação</h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Graduação, MBAs e certificações.
                        </p>
                    </div>

                    <EducationSection />
                </section>
            )}
        </main>
    );
}
