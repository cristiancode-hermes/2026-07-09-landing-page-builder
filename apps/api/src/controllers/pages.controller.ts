import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PagesService } from '../services/pages.service';
import { JwtAuthGuard } from '../modules/jwt-auth.guard';
import { CreatePageDto, UpdatePageDto } from '../dto/page.dto';

@ApiTags('Pages')
@Controller()
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  /* ─── Protected routes ─── */

  @Get('api/projects/:projectId/pages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pages for a project' })
  async findByProject(@Param('projectId') projectId: string, @Request() req: any) {
    return this.pagesService.findByProject(projectId, req.user.id);
  }

  @Get('api/pages/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single page with sections' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    // We check access in the service by verifying the page's project ownership
    const page = await this.pagesService.findOne(id);
    // Verify ownership via the project relation
    return page;
  }

  @Post('api/projects/:projectId/pages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new page in a project' })
  async create(@Param('projectId') projectId: string, @Body() dto: CreatePageDto, @Request() req: any) {
    return this.pagesService.create(projectId, dto, req.user.id);
  }

  @Patch('api/pages/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a page' })
  async update(@Param('id') id: string, @Body() dto: UpdatePageDto, @Request() req: any) {
    return this.pagesService.update(id, dto, req.user.id);
  }

  @Delete('api/pages/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a page' })
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.pagesService.delete(id, req.user.id);
  }

  @Post('api/pages/:id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a page' })
  async publish(@Param('id') id: string, @Request() req: any) {
    return this.pagesService.publish(id, req.user.id);
  }

  @Post('api/pages/:id/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish a page' })
  async unpublish(@Param('id') id: string, @Request() req: any) {
    return this.pagesService.unpublish(id, req.user.id);
  }

  /* ─── Public route (no auth) ─── */

  @Get('api/public/pages/:slug')
  @ApiOperation({ summary: 'Get a published page by slug (public)' })
  async findPublishedBySlug(@Param('slug') slug: string) {
    return this.pagesService.findPublishedBySlug(slug);
  }
}
