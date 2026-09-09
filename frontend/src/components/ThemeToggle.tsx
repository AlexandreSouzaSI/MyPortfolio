'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getTheme, toggleTheme, type Theme } from '@/lib/theme';

// Botão dia/noite, fixo no canto superior direito — igual ao toggle usado
// no NuGalho Hub e no RotaApp (mesmo padrão de lib/theme.ts).
export function ThemeToggle() {
    const [theme, setThemeState] = useState<Theme>('dark');

    useEffect(() => {
        setThemeState(getTheme());
    }, []);

    function handleClick() {
        setThemeState(toggleTheme());
    }

    return (
        <button
            onClick={handleClick}
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            className="fixed right-4 top-4 z-50 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur p-2.5 text-zinc-700 dark:text-zinc-300 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
