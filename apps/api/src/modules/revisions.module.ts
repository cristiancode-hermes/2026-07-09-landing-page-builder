import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Revision } from '../entities/revision.entity';
import { RevisionSection } from '../entities/revision-section.entity';
import { Section } from '../entities/section.entity';
import { Page } from '../entities/page.entity';
import { RevisionsService } from '../services/revisions.service';
import { RevisionsController } from '../controllers/revisions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Revision, RevisionSection, Section, Page]),
  ],
  providers: [RevisionsService],
  controllers: [RevisionsController],
  exports: [RevisionsService],
})
export class RevisionsModule {}
