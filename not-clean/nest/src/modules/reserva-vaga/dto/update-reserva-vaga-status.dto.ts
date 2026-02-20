import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReservaVagaStatusEnum } from '../enums/reserva-vaga-status.enum';
import { ReservaVagaSubstatusEnum } from '../enums/reserva-vaga-substatus.enum';

export class UpdateReservaVagaStatusDto {
  @ApiProperty({
    enum: ReservaVagaStatusEnum,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(ReservaVagaStatusEnum)
  status: ReservaVagaStatusEnum;

  @ApiPropertyOptional({
    enum: ReservaVagaSubstatusEnum,
  })
  @IsOptional()
  @IsEnum(ReservaVagaSubstatusEnum)
  substatus?: ReservaVagaSubstatusEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observacao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  matricula?: string;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dataReferencia: Date;
}
