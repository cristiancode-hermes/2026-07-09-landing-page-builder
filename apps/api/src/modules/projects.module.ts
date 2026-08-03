import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { Page } from '../entities/page.entity';
import { ProjectsService } from '../services/projects.service';
import { ProjectsController } from '../controllers/projects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Page])],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
