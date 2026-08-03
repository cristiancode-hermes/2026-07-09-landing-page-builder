import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from '../entities/page.entity';
import { Project } from '../entities/project.entity';
import { Section } from '../entities/section.entity';
import { Revision } from '../entities/revision.entity';
import { RevisionSection } from '../entities/revision-section.entity';
import { CreatePageDto, UpdatePageDto } from '../dto/page.dto';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Revision)
    private readonly revisionRepository: Repository<Revision>,
    @InjectRepository(RevisionSection)
    private readonly revisionSectionRepository: Repository<RevisionSection>,
  ) {}

  async findByProject(projectId: string, userId: string): Promise<Page[]> {
    // Verify project ownership
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException('Access denied');

    return this.pageRepository.find({
      where: { projectId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Page> {
    const page = await this.pageRepository.findOne({
      where: { id },
      relations: { sections: true },
    });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async findPublishedBySlug(slug: string): Promise<Page> {
    const page = await this.pageRepository.findOne({
      where: { slug, isPublished: true },
      relations: { sections: true },
    });
    if (!page) throw new NotFoundException('Published page not found');
    return page;
  }

  async create(projectId: string, dto: CreatePageDto, userId: string): Promise<Page> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException('Access denied');

    const slug = dto.slug || dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const page = this.pageRepository.create({
      projectId,
      title: dto.title,
      slug,
    });
    return this.pageRepository.save(page);
  }

  async update(id: string, dto: UpdatePageDto, userId: string): Promise<Page> {
    const page = await this.pageRepository.findOne({
      where: { id },
      relations: { project: true },
    });
    if (!page) throw new NotFoundException('Page not found');
    if (page.project.userId !== userId) throw new ForbiddenException('Access denied');

    if (dto.title !== undefined) page.title = dto.title;
    if (dto.slug !== undefined) page.slug = dto.slug;
    if (dto.seoTitle !== undefined) page.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined) page.seoDescription = dto.seoDescription;
    if (dto.customCss !== undefined) page.customCss = dto.customCss;
    if (dto.customJs !== undefined) page.customJs = dto.customJs;
    if (dto.favicon !== undefined) page.favicon = dto.favicon;

    return this.pageRepository.save(page);
  }

  async delete(id: string, userId: string): Promise<{ deleted: boolean }> {
    const page = await this.pageRepository.findOne({
      where: { id },
      relations: { project: true },
    });
    if (!page) throw new NotFoundException('Page not found');
    if (page.project.userId !== userId) throw new ForbiddenException('Access denied');

    await this.pageRepository.remove(page);
    return { deleted: true };
  }

  async publish(id: string, userId: string): Promise<{ page: Page; revision: Revision; url: string }> {
    const page = await this.pageRepository.findOne({
      where: { id },
      relations: { project: true, sections: true },
    });
    if (!page) throw new NotFoundException('Page not found');
    if (page.project.userId !== userId) throw new ForbiddenException('Access denied');

    page.isPublished = true;
    page.publishedUrl = `/p/${page.slug}`;
    page.publishedAt = new Date();
    const savedPage = await this.pageRepository.save(page);

    // Create a publish revision
    const maxVersion = await this.revisionRepository
      .createQueryBuilder('rev')
      .where('rev.pageId = :pageId', { pageId: id })
      .select('MAX(rev.versionNumber)', 'max')
      .getRawOne();
    const nextVersion = (maxVersion?.max || 0) + 1;

    const revision = this.revisionRepository.create({
      pageId: id,
      versionNumber: nextVersion,
      changeSummary: 'Published page',
      revisionType: 'publish',
    });
    const savedRevision = await this.revisionRepository.save(revision);

    // Snapshot current sections
    const currentSections = await this.sectionRepository.find({ where: { pageId: id } });
    for (const section of currentSections) {
      const revisionSection = this.revisionSectionRepository.create({
        revisionId: savedRevision.id,
        sectionId: section.id,
        sectionType: section.sectionType,
        position: section.position,
        content: section.content,
        styles: section.styles,
      });
      await this.revisionSectionRepository.save(revisionSection);
    }

    const fullPage = await this.pageRepository.findOne({
      where: { id },
      relations: { sections: true },
    }) as Page;

    return { page: fullPage, revision: savedRevision, url: savedPage.publishedUrl! };
  }

  async unpublish(id: string, userId: string): Promise<{ page: Page }> {
    const page = await this.pageRepository.findOne({
      where: { id },
      relations: { project: true },
    });
    if (!page) throw new NotFoundException('Page not found');
    if (page.project.userId !== userId) throw new ForbiddenException('Access denied');

    page.isPublished = false;
    page.publishedUrl = null;
    page.publishedAt = null;
    const saved = await this.pageRepository.save(page);

    return { page: saved };
  }
}
