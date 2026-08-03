import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRevisionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  changeSummary?: string;
}
