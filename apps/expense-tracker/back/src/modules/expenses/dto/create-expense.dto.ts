import { IsString, IsNumber, IsOptional, IsNotEmpty, IsDateString, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ----------------------------------------------------------------------

export class CreateExpenseDto {
  @ApiProperty({ example: 'Supermercado Extra' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @ApiProperty({ example: 150.5 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: '2024-02-15' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'uuid-da-categoria' })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Compras do mês' })
  @IsString()
  @IsOptional()
  notes?: string;
}
