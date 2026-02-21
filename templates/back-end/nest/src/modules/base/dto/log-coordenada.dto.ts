import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Motivo } from '../entities/enums/log-coordenada.enum';

export class LogCoordenadaDto {
  @ApiProperty({
    enum: Motivo,
  })
  @IsEnum(Motivo)
  @IsNotEmpty()
  motivo: Motivo;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endereco: string;
}
