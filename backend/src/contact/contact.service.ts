import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
    constructor(private readonly prisma: PrismaService) { }

    create(dto: CreateContactDto) {
        // Por enquanto só grava no banco. Se quiser ser avisado na hora,
        // dá pra plugar aqui um envio de e-mail/WhatsApp depois (mesmo
        // padrão do módulo whatsapp do Controle NF).
        return this.prisma.contactMessage.create({ data: dto });
    }

    findAll() {
        return this.prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    markAsRead(id: string) {
        return this.prisma.contactMessage.update({
            where: { id },
            data: { read: true },
        });
    }
}
