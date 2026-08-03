import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RevisionsService } from '../services/revisions.service';
import { JwtAuthGuard } from '../modules/jwt-auth.guard';
import { CreateRevisionDto } from '../dto/revision.dto';

@ApiTags('Revisions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class RevisionsController {
  constructor(private readonly revisionsService: RevisionsService) {}

  @Get('api/pages/:pageId/revisions')
  @ApiOperation({ summary: 'Get all revisions for a page' })
  async findByPage(@Param('pageId') pageId: string, @Request() req: any) {
    return this.revisionsService.findByPage(pageId, req.user.id);
  }

  @Get('api/revisions/:id')
  @ApiOperation({ summary: 'Get a single revision with sections' })
  async findOne(@Param('id') id: string) {
    return this.revisionsService.findOne(id);
  }

  @Post('api/pages/:pageId/revisions')
  @ApiOperation({ summary: 'Create a manual revision snapshot' })
  async create(@Param('pageId') pageId: string, @Body() dto: CreateRevisionDto, @Request() req: any) {
    return this.revisionsService.create(pageId, dto, req.user.id);
  }

  @Post('api/revisions/:id/restore')
  @ApiOperation({ summary: 'Restore a revision' })
  async restore(@Param('id') id: string, @Request() req: any) {
    return this.revisionsService.restore(id, req.user.id);
  }
}
