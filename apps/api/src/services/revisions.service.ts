import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Revision } from '../entities/revision.entity';
import { RevisionSection } from '../entities/revision-section.entity';
import { Section } from '../entities/section.entity';
import { Page } from '../entities/page.entity';
import { CreateRevisionDto } from '../dto/revision.dto';

@Injectable()
export class RevisionsService {
  constructor(
    @InjectRepository(Revision)
    private readonly revisionRepository: Repository<Revision>,
    @InjectRepository(RevisionSection)
    private readonly revisionSectionRepository: Repository<RevisionSection>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {}

  async findByPage(pageId: string, userId: string): Promise<Revision[]> {
    await this.verifyPageAccess(pageId, userId);
    return this.revisionRepository.find({
      where: { pageId },
      order: { versionNumber: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Revision> {
    const revision = await this.revisionRepository.findOne({
      where: { id },
      relations: { sections: true },
    });
    if (!revision) throw new NotFoundException('Revision not found');
    return revision;
  }

  async create(pageId: string, dto: CreateRevisionDto, userId: string): Promise<Revision> {
    const page = await this.pageRepository.findOne({
      where: { id: pageId },
      relations: { project: true },
    });
    if (!page) throw new NotFoundException('Page not found');
    if (page.project.userId !== userId) throw new ForbiddenException('Access denied');

    // Get max version
    const maxVersion = await this.revisionRepository
      .createQueryBuilder('rev')
      .where('rev.pageId = :pageId', { pageId })
      .select('MAX(rev.versionNumber)', 'max')
      .getRawOne();
    const nextVersion = (maxVersion?.max || 0) + 1;

    const revision = this.revisionRepository.create({
      pageId,
      versionNumber: nextVersion,
      changeSummary: dto.changeSummary || null,
      revisionType: 'manual',
    });
    const savedRevision = await this.revisionRepository.save(revision);

    // Snapshot current sections
    const currentSections = await this.sectionRepository.find({ where: { pageId } });
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

    return this.revisionRepository.findOne({
      where: { id: savedRevision.id },
      relations: { sections: true },
    }) as Promise<Revision>;
  }

  async restore(id: string, userId: string): Promise<{ page: Page; sections: Section[]; revision: Revision }> {
    const revision = await this.revisionRepository.findOne({
      where: { id },
      relations: { sections: true, page: { project: true } },
    });
    if (!revision) throw new NotFoundException('Revision not found');
    if (revision.page.project.userId !== userId) throw new ForbiddenException('Access denied');

    const pageId = revision.pageId;

    // Save current state as a new revision first
    const maxVersion = await this.revisionRepository
      .createQueryBuilder('rev')
      .where('rev.pageId = :pageId', { pageId })
      .select('MAX(rev.versionNumber)', 'max')
      .getRawOne();
    const nextVersion = (maxVersion?.max || 0) + 1;

    const currentSections = await this.sectionRepository.find({ where: { pageId } });
    if (currentSections.length > 0) {
      const autoRevision = this.revisionRepository.create({
        pageId,
        versionNumber: nextVersion,
        changeSummary: 'Auto-saved before restore',
        revisionType: 'auto_save',
      });
      const savedAuto = await this.revisionRepository.save(autoRevision);
      for (const section of currentSections) {
        const rs = this.revisionSectionRepository.create({
          revisionId: savedAuto.id,
          sectionId: section.id,
          sectionType: section.sectionType,
          position: section.position,
          content: section.content,
          styles: section.styles,
        });
        await this.revisionSectionRepository.save(rs);
      }
    }

    // Delete current sections
    await this.sectionRepository.delete({ pageId });

    // Recreate sections from revision
    const newSections: Section[] = [];
    for (const rs of revision.sections) {
      const section = this.sectionRepository.create({
        pageId,
        sectionType: rs.sectionType as any,
        position: rs.position,
        content: rs.content,
        styles: rs.styles,
      });
      const saved = await this.sectionRepository.save(section);
      newSections.push(saved);
    }

    // Create a restore revision
    const restoreVersion = (maxVersion?.max || 0) + 1 + (currentSections.length > 0 ? 1 : 0);
    const restoreRevision = this.revisionRepository.create({
      pageId,
      versionNumber: restoreVersion,
      changeSummary: `Restored from version ${revision.versionNumber}`,
      revisionType: 'restore',
    });
    const savedRestoreRevision = await this.revisionRepository.save(restoreRevision);
    for (const section of newSections) {
      const rs = this.revisionSectionRepository.create({
        revisionId: savedRestoreRevision.id,
        sectionId: section.id,
        sectionType: section.sectionType,
        position: section.position,
        content: section.content,
        styles: section.styles,
      });
      await this.revisionSectionRepository.save(rs);
    }

    const page = await this.pageRepository.findOne({
      where: { id: pageId },
      relations: { sections: true },
    }) as Page;

    return { page, sections: page.sections, revision: savedRestoreRevision };
  }

  private async verifyPageAccess(pageId: string, userId: string): Promise<void> {
    const page = await this.pageRepository.findOne({
      where: { id: pageId },
      relations: { project: true },
    });
    if (!page) throw new NotFoundException('Page not found');
    if (page.project.userId !== userId) throw new ForbiddenException('Access denied');
  }
}
