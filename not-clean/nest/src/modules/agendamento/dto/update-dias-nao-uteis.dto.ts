import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { CreateDiasNaoUteisDto } from './dias-nao-uteis.dto';

export class UpdateDiasNaoUteisDto extends PartialType(CreateDiasNaoUteisDto) {
  @ApiPropertyOptional({})
  @IsOptional()
  @IsInt()
  @IsPositive()
  id?: number;
}
