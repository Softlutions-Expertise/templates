import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCidadeDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
