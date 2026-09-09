import { Award, GraduationCap } from 'lucide-react';
import { certifications, education } from '@/lib/resume';

export function EducationSection() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                {education.map((item) => (
                    <div
                        key={`${item.institution}-${item.degree}`}
                        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400">
                                <GraduationCap size={18} />
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <h3 className="text-lg font-bold">{item.degree}</h3>
                                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                        {item.period}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    {item.institution}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    <Award size={16} />
                    Certificações
                </h3>
                <div className="flex flex-wrap gap-2">
                    {certifications.map((cert) => (
                        <span
                            key={cert}
                            className="rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400"
                        >
                            {cert}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
