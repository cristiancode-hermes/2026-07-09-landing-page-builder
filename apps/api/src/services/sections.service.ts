import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from '../entities/section.entity';
import { Page } from '../entities/page.entity';
import { Project } from '../entities/project.entity';
import { CreateSectionDto, UpdateSectionDto, ReorderSectionsDto } from '../dto/section.dto';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findByPage(pageId: string, userId: string): Promise<Section[]> {
    await this.verifyPageAccess(pageId, userId);
    return this.sectionRepository.find({
      where: { pageId },
      order: { position: 'ASC' },
    });
  }

  async create(pageId: string, dto: CreateSectionDto, userId: string): Promise<Section> {
    await this.verifyPageAccess(pageId, userId);

    // Get max position
    const maxPos = await this.sectionRepository
      .createQueryBuilder('sec')
      .where('sec.pageId = :pageId', { pageId })
      .select('MAX(sec.position)', 'max')
      .getRawOne();
    const position = dto.position ?? ((maxPos?.max ?? -1) + 1);

    const section = this.sectionRepository.create({
      pageId,
      sectionType: dto.type,
      position,
      content: dto.content || this.getDefaultContent(dto.type),
      styles: {},
    });
    return this.sectionRepository.save(section);
  }

  async update(id: string, dto: UpdateSectionDto, userId: string): Promise<Section> {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: { page: { project: true } },
    });
    if (!section) throw new NotFoundException('Section not found');
    if (section.page.project.userId !== userId) throw new ForbiddenException('Access denied');

    if (dto.content !== undefined) section.content = dto.content;
    if (dto.position !== undefined) section.position = dto.position;
    if (dto.styles !== undefined) section.styles = dto.styles;

    return this.sectionRepository.save(section);
  }

  async delete(id: string, userId: string): Promise<{ deleted: boolean }> {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: { page: { project: true } },
    });
    if (!section) throw new NotFoundException('Section not found');
    if (section.page.project.userId !== userId) throw new ForbiddenException('Access denied');

    await this.sectionRepository.remove(section);
    return { deleted: true };
  }

  async duplicate(id: string, userId: string): Promise<Section> {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: { page: { project: true } },
    });
    if (!section) throw new NotFoundException('Section not found');
    if (section.page.project.userId !== userId) throw new ForbiddenException('Access denied');

    // Get max position
    const maxPos = await this.sectionRepository
      .createQueryBuilder('sec')
      .where('sec.pageId = :pageId', { pageId: section.pageId })
      .select('MAX(sec.position)', 'max')
      .getRawOne();

    const duplicate = this.sectionRepository.create({
      pageId: section.pageId,
      sectionType: section.sectionType,
      position: (maxPos?.max ?? section.position) + 1,
      content: { ...section.content },
      styles: { ...section.styles },
      visible: section.visible,
    });
    return this.sectionRepository.save(duplicate);
  }

  async reorder(pageId: string, dto: ReorderSectionsDto, userId: string): Promise<Section[]> {
    await this.verifyPageAccess(pageId, userId);

    for (const item of dto.items) {
      await this.sectionRepository.update(item.id, { position: item.position });
    }

    return this.sectionRepository.find({
      where: { pageId },
      order: { position: 'ASC' },
    });
  }

  private async verifyPageAccess(pageId: string, userId: string): Promise<void> {
    const page = await this.pageRepository.findOne({
      where: { id: pageId },
      relations: { project: true },
    });
    if (!page) throw new NotFoundException('Page not found');
    if (page.project.userId !== userId) throw new ForbiddenException('Access denied');
  }

  private getDefaultContent(type: string): Record<string, any> {
    switch (type) {
      case 'hero':
        return { headline: 'New Headline', subtitle: 'Subtitle here', buttonText: 'Get Started', buttonUrl: '#', backgroundColor: '#ffffff', textColor: '#000000', alignment: 'center' };
      case 'features':
        return { title: 'Features', subtitle: 'What we offer', cards: [] };
      case 'pricing':
        return { title: 'Pricing', subtitle: 'Choose your plan', plans: [] };
      case 'testimonials':
        return { title: 'Testimonials', items: [] };
      case 'contact':
        return { title: 'Contact Us', subtitle: 'Get in touch', email: 'hello@example.com', buttonText: 'Send', backgroundColor: '#f9f9f9' };
      case 'footer':
        return { companyName: 'My Company', links: [], copyrightText: '© 2024 All rights reserved.', backgroundColor: '#333333' };
      default:
        return {};
    }
  }
}
