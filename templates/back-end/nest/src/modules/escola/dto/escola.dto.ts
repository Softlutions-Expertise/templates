import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { ObjectUUIDDto } from '../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { Unique } from '../../../helpers/validators/unique';
import { CreateContatoDto } from '../../base/dto/create-contato.dto';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';
import {
  Categoria,
  Conveniada,
  Dependencia,
  Esfera,
  Mantedora,
  Regulamentacao,
  SituacaoFuncionamento,
  Tipo,
  Unidade,
} from '../entities/enums/escola.enum';
import { EscolaEntity } from '../entities/escola.entity';

export class EscolaDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  @MaxLength(8)
  @Validate(Unique, [EscolaEntity])
  codigoInep!: string;

  @ApiPropertyOptional()
  @IsOptional()
  foto!: string;

  @ApiProperty({
    enum: SituacaoFuncionamento,
  })
  @IsOptional()
  @IsEnum(SituacaoFuncionamento)
  situacaoFuncionamento!: SituacaoFuncionamento;

  @ApiPropertyOptional()
  @IsOptional()
  latitude!: string;

  @ApiPropertyOptional()
  @IsOptional()
  longitude!: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  @Length(5, 5)
  codigoRegional!: number;

  @ApiProperty()
  @IsOptional()
  nomeRegional!: string;

  @ApiProperty({
    enum: Dependencia,
  })
  @IsOptional()
  @IsEnum(Dependencia)
  dependenciaAdministrativa!: Dependencia;

  @ApiPropertyOptional({
    enum: Categoria,
  })
  @IsEnum(Categoria)
  @IsOptional()
  categoriaEscolaPrivada!: Categoria;

  @ApiPropertyOptional({
    isArray: true,
    enum: Mantedora,
  })
  @IsEnum(Mantedora, { each: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  mantedoraEscolaPrivada!: Mantedora[];

  @ApiPropertyOptional()
  @IsOptional()
  cnpjMantedoraEscolaPrivada!: string;

  @ApiProperty()
  @IsOptional()
  cnpjEscola!: string;

  @ApiProperty({
    enum: Regulamentacao,
  })
  @IsOptional()
  @IsEnum(Regulamentacao)
  regulamentacao!: Regulamentacao;

  @ApiProperty()
  @IsOptional()
  autorizacaoFuncionamento: string;

  @ApiProperty()
  @IsString()
  razaoSocial!: string;

  @ApiProperty()
  @IsString()
  nomeFantasia!: string;

  @ApiProperty()
  @IsOptional()
  denominacaoEscola!: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Conveniada)
  conveniadaPoderPublico!: Conveniada;

  @ApiProperty()
  @IsOptional()
  dataCriacao!: Date;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Tipo)
  tipoEscola!: Tipo;

  @ApiProperty({
    enum: Esfera,
  })
  @IsOptional()
  @IsEnum(Esfera)
  esferaAdministrativaConselho!: Esfera;

  @ApiProperty({
    enum: Unidade,
  })
  @IsOptional()
  @IsEnum(Unidade)
  unidadeVinculadaEscola!: Unidade;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  @Length(8, 8)
  codigoEscolaSede!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  @Length(14, 14)
  codigoInstituicaoSuperior!: number;

  @ApiProperty({ default: 3 })
  @IsNotEmpty()
  @IsNumber()
  prazoMatricula!: number;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateContatoDto)
  contato: CreateContatoDto;

  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @Validate(EntityExist, [SecretariaMunicipalEntity, 'id', 'id'])
  @IsOptional()
  @ValidateNested()
  @Type(() => ObjectUUIDDto)
  secretariaMunicipal!: SecretariaMunicipalEntity;
}
