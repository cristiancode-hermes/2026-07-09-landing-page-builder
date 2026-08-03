import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SectionsService } from '../services/sections.service';
import { JwtAuthGuard } from '../modules/jwt-auth.guard';
import { CreateSectionDto, UpdateSectionDto, ReorderSectionsDto } from '../dto/section.dto';

@ApiTags('Sections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get('api/pages/:pageId/sections')
  @ApiOperation({ summary: 'Get all sections for a page' })
  async findByPage(@Param('pageId') pageId: string, @Request() req: any) {
    return this.sectionsService.findByPage(pageId, req.user.id);
  }

  @Post('api/pages/:pageId/sections')
  @ApiOperation({ summary: 'Create a new section' })
  async create(@Param('pageId') pageId: string, @Body() dto: CreateSectionDto, @Request() req: any) {
    return this.sectionsService.create(pageId, dto, req.user.id);
  }

  @Patch('api/sections/:id')
  @ApiOperation({ summary: 'Update a section' })
  async update(@Param('id') id: string, @Body() dto: UpdateSectionDto, @Request() req: any) {
    return this.sectionsService.update(id, dto, req.user.id);
  }

  @Delete('api/sections/:id')
  @ApiOperation({ summary: 'Delete a section' })
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.sectionsService.delete(id, req.user.id);
  }

  @Post('api/sections/:id/duplicate')
  @ApiOperation({ summary: 'Duplicate a section' })
  async duplicate(@Param('id') id: string, @Request() req: any) {
    return this.sectionsService.duplicate(id, req.user.id);
  }

  @Put('api/pages/:pageId/sections/reorder')
  @ApiOperation({ summary: 'Reorder sections' })
  async reorder(@Param('pageId') pageId: string, @Body() dto: ReorderSectionsDto, @Request() req: any) {
    return this.sectionsService.reorder(pageId, dto, req.user.id);
  }
}
