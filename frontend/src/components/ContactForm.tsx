'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/site-config';

// Formulário de contato pra recrutador/cliente falar direto com o dono do
// portfólio. Envia pro backend (POST /contact); se a API não estiver no ar
// (ex: site publicado sem backend configurado ainda), cai no fallback de
// abrir o cliente de e-mail com "mailto:" pra não travar o visitante.
export function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSending(true);

        try {
            await api.post('/contact', { name, email, company, message });
            toast.success('Mensagem enviada! Retorno em breve.');
            setName('');
            setEmail('');
            setCompany('');
            setMessage('');
        } catch {
            toast.error(
                'Não consegui enviar por aqui agora. Abrindo seu e-mail...',
            );
            window.location.href = `mailto:${siteConfig.email}?subject=Contato pelo portfólio&body=${encodeURIComponent(message)}`;
        } finally {
            setSending(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Nome
                    </label>
                    <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        E-mail
                    </label>
                    <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Empresa (opcional)
                </label>
                <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Mensagem
                </label>
                <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
                />
            </div>

            <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
                <Send size={16} />
                {sending ? 'Enviando...' : 'Enviar mensagem'}
            </button>
        </form>
    );
}
