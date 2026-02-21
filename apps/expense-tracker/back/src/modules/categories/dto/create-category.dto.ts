import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ----------------------------------------------------------------------

export class CreateCategoryDto {
  @ApiProperty({ example: 'Alimentação' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: '#FF5722' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ example: 'restaurant' })
  @IsString()
  @IsOptional()
  icon?: string;
}
