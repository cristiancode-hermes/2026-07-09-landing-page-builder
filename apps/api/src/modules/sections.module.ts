import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from '../entities/section.entity';
import { Page } from '../entities/page.entity';
import { Project } from '../entities/project.entity';
import { SectionsService } from '../services/sections.service';
import { SectionsController } from '../controllers/sections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Section, Page, Project])],
  providers: [SectionsService],
  controllers: [SectionsController],
  exports: [SectionsService],
})
export class SectionsModule {}
