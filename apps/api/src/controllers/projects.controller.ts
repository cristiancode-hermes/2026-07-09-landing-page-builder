import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from '../services/projects.service';
import { JwtAuthGuard } from '../modules/jwt-auth.guard';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects for current user' })
  async findAll(@Request() req: any) {
    return this.projectsService.findAll(req.user.id);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export projects as CSV' })
  async exportCsv(@Request() req: any) {
    const result = await this.projectsService.exportCsv(req.user.id);
    const res: any = req.res;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.csv);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: any, @Request() req: any) {
    return this.projectsService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.projectsService.update(id, req.user.id, dto);
  }

  @Get(':id/pages')
  @ApiOperation({ summary: 'Get all pages for a project' })
  async getPages(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.getPages(id, req.user.id);
  }
}
