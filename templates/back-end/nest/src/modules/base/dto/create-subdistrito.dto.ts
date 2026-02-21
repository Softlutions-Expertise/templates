import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubdistritoDto {
  @ApiProperty()
  @IsOptional()
  id: string;

  @ApiProperty()
  nome: string;
}
