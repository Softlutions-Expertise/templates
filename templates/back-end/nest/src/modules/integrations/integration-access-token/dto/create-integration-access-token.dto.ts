import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { EntityExist } from '../../../../helpers/validators/entity-exist';
import { ColaboradorEntity } from '../../../pessoa/entities/colaborador.entity';

export class CreateIntegrationAccessTokenDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  validoAte?: string;

  @ApiPropertyOptional({ type: () => ColaboradorEntity })
  @IsOptional()
  @Validate(EntityExist, [ColaboradorEntity, 'id', 'id'])
  herdaPermissoesDeColaborador: ColaboradorEntity | null;

  /**
   * @deprecated Use herdaPermissoesDeColaborador instead
   */
  get herdaPermissoesDeFuncionario(): ColaboradorEntity | null {
    return this.herdaPermissoesDeColaborador;
  }
}
