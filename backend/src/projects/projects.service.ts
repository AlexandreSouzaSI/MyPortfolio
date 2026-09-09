import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(private readonly prisma: PrismaService) { }

    findAll() {
        return this.prisma.project.findMany({
            orderBy: [{ featured: 'desc' }, { order: 'asc' }],
        });
    }

    async findBySlug(slug: string) {
        const project = await this.prisma.project.findUnique({
            where: { slug },
        });

        if (!project) {
            throw new NotFoundException('Projeto não encontrado.');
        }

        return project;
    }

    create(dto: CreateProjectDto) {
        return this.prisma.project.create({ data: dto });
    }

    async update(slug: string, dto: UpdateProjectDto) {
        await this.findBySlug(slug);

        return this.prisma.project.update({
            where: { slug },
            data: dto,
        });
    }

    async remove(slug: string) {
        await this.findBySlug(slug);

        await this.prisma.project.delete({ where: { slug } });

        return { ok: true };
    }
}
