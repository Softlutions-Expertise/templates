import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsString, IsObject, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EntrevistaEntity } from '../entities/entrevista.entity';
import { CriancaEntity } from '../../pessoa/entities/crianca.entity';
import { FuncionarioEntity } from 'src/modules/pessoa/entities/funcionario.entity';

export class CreateRegistrarContatoDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ type: () => CriancaEntity })
  @IsObject()
  @Type(() => CriancaEntity)
  crianca: CriancaEntity;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dataContato: string;

  @ApiProperty()
  @IsString()
  tipoContato: string;

  @ApiPropertyOptional()
  @IsOptional()
  comprovante: string;

  @ApiProperty()
  @IsString()
  nomeContato: string;

  @ApiProperty()
  @IsString()
  ligacaoAceita: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observacao: string;

  @ApiProperty({ type: () => EntrevistaEntity })
  @Type(() => EntrevistaEntity)
  @IsObject()
  entrevista: EntrevistaEntity;

  @ApiProperty({ type: () => FuncionarioEntity })
  @Type(() => FuncionarioEntity)
  @IsObject()
  servidor: FuncionarioEntity;
}
