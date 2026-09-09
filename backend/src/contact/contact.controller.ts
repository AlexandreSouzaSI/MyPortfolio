import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AdminTokenGuard } from '../common/admin-token.guard';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    // Pública — formulário de contato do site.
    @Post()
    create(@Body() dto: CreateContactDto) {
        return this.contactService.create(dto);
    }

    // Protegidas — só o dono do portfólio lê as mensagens recebidas.
    @UseGuards(AdminTokenGuard)
    @Get()
    findAll() {
        return this.contactService.findAll();
    }

    @UseGuards(AdminTokenGuard)
    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.contactService.markAsRead(id);
    }
}
