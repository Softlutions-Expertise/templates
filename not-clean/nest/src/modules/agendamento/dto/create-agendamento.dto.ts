import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { ObjectIDDto } from '../../../helpers/dtos/object-id.dto';
import { ObjectUUIDDto } from '../../../helpers/dtos/object-uuid.dto';
import { EntityExist } from '../../../helpers/validators/entity-exist';
import { CreateCidadeDto } from '../../base/dto/create-cidade.dto';
import { CidadeEntity } from '../../base/entities/cidade.entity';
import { LocalAtendimentoEntity } from '../../local-atendimento/local-atendimento.entity';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';
export class CreateAgendamentoDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  horario: string;

  @ApiProperty()
  @IsNotEmpty()
  nomeCrianca: string;

  @ApiProperty()
  @IsNotEmpty()
  cpfCrianca: string;

  @ApiProperty()
  @IsNotEmpty()
  dataNascimento: Date;

  @ApiProperty()
  @IsNotEmpty()
  data: Date;

  @ApiProperty()
  @IsNotEmpty()
  nomeRes: string;

  @ApiProperty()
  @IsNotEmpty()
  cpfRes: string;

  @ApiProperty()
  @IsNotEmpty()
  telefone: string;

  @ApiProperty({
    isArray: true,
    example: ['joao@escola.com.br', 'pedro@escola.com.br'],
  })
  @IsNotEmpty()
  @IsEmail({}, { each: true, message: 'O e-mail informado é inválido.' })
  email: string;

  @ApiProperty({ type: ObjectIDDto })
  @Validate(EntityExist, [CidadeEntity, 'id', 'id'])
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => ObjectIDDto)
  municipio: CreateCidadeDto;

  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty({
    type: ObjectUUIDDto,
  })
  @Validate(EntityExist, [LocalAtendimentoEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectUUIDDto)
  localAtendimento: LocalAtendimentoEntity;

  @ApiPropertyOptional({
    type: ObjectUUIDDto,
    description: 'Deprecated - Use localAtendimento instead'
  })
  @IsOptional()
  @Validate(EntityExist, [SecretariaMunicipalEntity, 'id', 'id'])
  @ValidateNested()
  @IsObject()
  @Type(() => ObjectUUIDDto)
  secretariaMunicipal?: SecretariaMunicipalEntity;
}
