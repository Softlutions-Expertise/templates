import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContatoDto } from './create-contato.dto';
import { CreateEnderecoDto } from './create-endereco.dto';

export class CreateEnderecoProprietyDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  endereco: CreateEnderecoDto;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateContatoDto)
  contato: CreateContatoDto;
}
