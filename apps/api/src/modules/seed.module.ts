import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { Page } from '../entities/page.entity';
import { Section } from '../entities/section.entity';
import { Revision } from '../entities/revision.entity';
import { RevisionSection } from '../entities/revision-section.entity';
import { SeedService } from '../services/seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project, Page, Section, Revision, RevisionSection]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
