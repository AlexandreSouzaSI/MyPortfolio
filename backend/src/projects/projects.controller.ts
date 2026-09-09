import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AdminTokenGuard } from '../common/admin-token.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    // Rotas públicas — é o que alimenta a página inicial do site.
    @Get()
    findAll() {
        return this.projectsService.findAll();
    }

    @Get(':slug')
    findBySlug(@Param('slug') slug: string) {
        return this.projectsService.findBySlug(slug);
    }

    // Rotas protegidas — usadas por um painel de admin (a construir depois)
    // ou diretamente via curl/Postman com o ADMIN_TOKEN.
    @UseGuards(AdminTokenGuard)
    @Post()
    create(@Body() dto: CreateProjectDto) {
        return this.projectsService.create(dto);
    }

    @UseGuards(AdminTokenGuard)
    @Patch(':slug')
    update(@Param('slug') slug: string, @Body() dto: UpdateProjectDto) {
        return this.projectsService.update(slug, dto);
    }

    @UseGuards(AdminTokenGuard)
    @Delete(':slug')
    remove(@Param('slug') slug: string) {
        return this.projectsService.remove(slug);
    }
}
