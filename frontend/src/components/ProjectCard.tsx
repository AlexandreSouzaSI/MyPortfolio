'use client';

import { useState } from 'react';
import { ChevronDown, ExternalLink, Hammer, Rocket } from 'lucide-react';
import type { Project } from '@/lib/types';
import { GithubIcon } from './icons';

// Card de "case study": mostra o resumo sempre visível (foto, tagline,
// stack) e esconde problema/solução/impacto atrás de "Ver detalhes" —
// evita que a página inicial fique um bloco gigante de texto quando
// houver vários projetos.
export function ProjectCard({ project }: { project: Project }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
            {project.imageUrl && (
                <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={project.imageUrl}
                        alt={`Print do sistema ${project.title}`}
                        className="h-48 w-full border-b border-zinc-200 dark:border-zinc-800 object-cover object-top"
                    />

                    {project.status === 'in_development' && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow">
                            <Hammer size={12} />
                            Em desenvolvimento
                        </span>
                    )}
                </div>
            )}

            <div className="flex flex-1 flex-col gap-4 p-6">
                <div>
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        {project.tagline}
                    </p>
                </div>

                {project.metrics && project.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                        {project.metrics.map((metric) => (
                            <div
                                key={metric.label}
                                className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2"
                            >
                                <p className="text-lg font-bold leading-tight text-zinc-900 dark:text-zinc-100">
                                    {metric.value}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {metric.label}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                        <span
                            key={tech}
                            className="rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-xs text-zinc-600 dark:text-zinc-400"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <button
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex items-center gap-1 self-start text-sm font-medium text-indigo-600 dark:text-indigo-400"
                >
                    {open ? 'Esconder detalhes' : 'Ver detalhes'}
                    <ChevronDown
                        size={16}
                        className={`transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                </button>

                {open && (
                    <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                        <div>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                Problema
                            </p>
                            <p>{project.problem}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                Solução
                            </p>
                            <p>{project.solution}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                Impacto
                            </p>
                            <p>{project.impact}</p>
                        </div>
                    </div>
                )}

                {project.nextStep && (
                    <p className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <Rocket size={16} className="mt-0.5 shrink-0 text-indigo-500" />
                        <span>{project.nextStep}</span>
                    </p>
                )}

                {(project.liveUrl || project.repoUrl) && (
                    <div className="flex flex-wrap items-center gap-3 pt-1 mt-auto">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                            >
                                <ExternalLink size={16} />
                                Ver projeto
                            </a>
                        )}
                        {project.repoUrl && (
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                                <GithubIcon size={14} />
                                Código
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
