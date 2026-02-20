import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

enum TipoContato {
  Casa = 'Casa',
  Trabalho = 'Trabalho',
  Celular = 'Celular',
  Fixo = 'Fixo',
}

export class Telefones {
  @ApiProperty()
  @IsString()
  numero: string;

  @ApiProperty()
  @IsEnum(TipoContato, { each: true })
  tipo: TipoContato[];

  @ApiProperty()
  @IsOptional()
  contatoPreferencial: string;
}

export class Emails {
  @ApiProperty({
    isArray: true,
    example: ['joao@escola.com.br', 'pedro@escola.com.br'],
  })
  @IsEmail({}, { each: true, message: 'O e-mail informado é inválido.' })
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  principal: boolean;
}
