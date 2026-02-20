import { IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExampleStatus } from '../entities/example.entity';

export class CreateExampleDto {
  @ApiProperty({ example: 'Example Item' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Description of the example item' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ExampleStatus, default: ExampleStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ExampleStatus)
  status?: ExampleStatus;

  @ApiPropertyOptional({ example: 99.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @ApiPropertyOptional({ example: { key: 'value' } })
  @IsOptional()
  metadata?: Record<string, any>;
}
