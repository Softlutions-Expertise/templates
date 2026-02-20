import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NivelAcesso } from '../entities/enums/pessoa.enum';
import { v4 as uuidv4 } from 'uuid';

export class CreateUsuarioDto {
  @ApiPropertyOptional({ default: uuidv4() })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(NivelAcesso)
  nivelAcesso: NivelAcesso;

  @ApiProperty()
  @IsBoolean()
  situacaoCadastral: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  usuario: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  senha: string;

  @ApiPropertyOptional({
    nullable: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  novo?: boolean;
}
