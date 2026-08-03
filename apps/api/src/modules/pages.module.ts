import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from '../entities/page.entity';
import { Project } from '../entities/project.entity';
import { Section } from '../entities/section.entity';
import { Revision } from '../entities/revision.entity';
import { RevisionSection } from '../entities/revision-section.entity';
import { PagesService } from '../services/pages.service';
import { PagesController } from '../controllers/pages.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Page, Project, Section, Revision, RevisionSection]),
  ],
  providers: [PagesService],
  controllers: [PagesController],
  exports: [PagesService],
})
export class PagesModule {}
