import axios from 'axios';

// Em produção, defina NEXT_PUBLIC_API_URL apontando pra URL pública do
// backend. Sem essa variável, cai no localhost pro desenvolvimento local.
export const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100';

export const api = axios.create({
    baseURL: API_URL,
});
