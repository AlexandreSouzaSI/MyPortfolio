import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

// Não é um sistema de login — é um portfólio pessoal de um usuário só.
// Protege as rotas de escrita (criar/editar/apagar projeto, ler mensagens
// de contato) com um token fixo definido em ADMIN_TOKEN (.env), enviado
// como "Authorization: Bearer <token>". Se algum dia isso crescer pra um
// painel com mais gente, trocar por JWT de verdade (mesmo padrão usado no
// Controle NF, em backend/src/auth).
@Injectable()
export class AdminTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;
        const expectedToken = process.env.ADMIN_TOKEN;

        if (!expectedToken) {
            throw new UnauthorizedException(
                'ADMIN_TOKEN não configurado no servidor.',
            );
        }

        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice('Bearer '.length)
            : undefined;

        if (!token || token !== expectedToken) {
            throw new UnauthorizedException('Token inválido.');
        }

        return true;
    }
}
