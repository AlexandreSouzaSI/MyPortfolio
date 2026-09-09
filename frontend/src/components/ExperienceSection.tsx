import { Briefcase, MapPin } from 'lucide-react';
import { experience } from '@/lib/resume';

export function ExperienceSection() {
    return (
        <div className="space-y-4">
            {experience.map((item) => (
                <div
                    key={`${item.company}-${item.period}`}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
                >
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400">
                            <Briefcase size={18} />
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h3 className="text-lg font-bold">{item.role}</h3>
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {item.period}
                                </span>
                            </div>

                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                {item.company}
                            </p>

                            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                                <MapPin size={12} />
                                {item.location}
                            </p>

                            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                                {item.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
