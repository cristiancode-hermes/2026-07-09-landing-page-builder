import { IsString, IsOptional, IsInt, IsObject, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSectionDto {
  @ApiProperty({ enum: ['hero', 'features', 'pricing', 'testimonials', 'contact', 'footer'] })
  @IsString()
  type: 'hero' | 'features' | 'pricing' | 'testimonials' | 'contact' | 'footer';

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  content?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}

export class UpdateSectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  content?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  styles?: Record<string, any>;
}

export class ReorderItemDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  position: number;
}

export class ReorderSectionsDto {
  @ApiProperty({ type: [ReorderItemDto] })
  items: ReorderItemDto[];
}
