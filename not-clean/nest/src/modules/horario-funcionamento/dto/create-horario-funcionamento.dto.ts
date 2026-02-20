import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { DiaSemanaEnum } from '../enums/dias-semana.enum';

export class CreateHorarioFuncionamentoDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ default: false })
  @IsNotEmpty()
  @IsBoolean()
  ativo: boolean;

  @ApiProperty({ enum: DiaSemanaEnum })
  @IsNotEmpty()
  @IsEnum(DiaSemanaEnum)
  diaSemana: DiaSemanaEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, {
    message: 'inicioManha deve estar no formato HH:MM ou HH:MM:SS',
  })
  inicioManha: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, {
    message: 'fimManha deve estar no formato HH:MM ou HH:MM:SS',
  })
  fimManha: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, {
    message: 'inicioTarde deve estar no formato HH:MM ou HH:MM:SS',
  })
  inicioTarde: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, {
    message: 'fimTarde deve estar no formato HH:MM ou HH:MM:SS',
  })
  fimTarde: string;
}
