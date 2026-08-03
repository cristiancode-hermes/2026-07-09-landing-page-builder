import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Project } from '../entities/project.entity';
import { Page } from '../entities/page.entity';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {}

  async findAll(userId: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { userId, deletedAt: IsNull() },
      relations: { pages: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: { pages: true },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return project;
  }

  async create(dto: CreateProjectDto, userId: string): Promise<Project> {
    const slug = dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check uniqueness
    const existing = await this.projectRepository.findOne({
      where: { userId, slug },
    });
    if (existing) {
      throw new ConflictException('A project with this slug already exists');
    }

    const project = this.projectRepository.create({
      name: dto.name,
      slug,
      userId,
      description: '',
    });
    const savedProject = await this.projectRepository.save(project);

    // Create a default page
    const page = this.pageRepository.create({
      projectId: savedProject.id,
      title: 'Home',
      slug: 'home',
    });
    await this.pageRepository.save(page);

    return this.projectRepository.findOne({
      where: { id: savedProject.id },
      relations: { pages: true },
    }) as Promise<Project>;
  }

  async update(id: string, dto: UpdateProjectDto, userId: string): Promise<Project> {
    const project = await this.findOne(id, userId);

    if (dto.slug && dto.slug !== project.slug) {
      const existing = await this.projectRepository.findOne({
        where: { userId, slug: dto.slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('A project with this slug already exists');
      }
      project.slug = dto.slug;
    }
    if (dto.name !== undefined) project.name = dto.name;

    return this.projectRepository.save(project);
  }

  async softDelete(id: string, userId: string): Promise<{ deleted: boolean }> {
    const project = await this.findOne(id, userId);
    project.deletedAt = new Date();
    await this.projectRepository.save(project);
    return { deleted: true };
  }

  async restore(id: string, userId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      withDeleted: true,
    } as any);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    project.deletedAt = null;
    return this.projectRepository.save(project);
  }

  async getPages(projectId: string, userId: string): Promise<Page[]> {
    await this.findOne(projectId, userId);
    return this.pageRepository.find({
      where: { projectId },
      order: { createdAt: 'ASC' },
    });
  }

  async exportCsv(userId: string) {
    const projects = await this.projectRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const escape = (v: unknown): string => {
      const s = v == null ? '' : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const header = ['id', 'name', 'slug', 'description', 'created_at'];
    const rows = projects.map((p) => [
      p.id, p.name, p.slug, p.description ?? '',
      p.createdAt.toISOString?.()?.slice(0, 10) ?? '',
    ]);

    return {
      filename: `landing-projects-${new Date().toISOString().slice(0, 10)}.csv`,
      csv: [header, ...rows].map((r) => r.map(escape).join(',')).join('\n'),
    };
  }
}
