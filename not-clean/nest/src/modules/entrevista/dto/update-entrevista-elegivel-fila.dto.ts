import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateEntrevistaElegivelFilaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  elegivelParaFila: boolean;
}
