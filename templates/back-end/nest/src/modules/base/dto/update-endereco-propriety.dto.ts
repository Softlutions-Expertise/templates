import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContatoDto } from './create-contato.dto';
import { UpdateEnderecoDto } from './update-endereco.dto';

export class UpdateEnderecoProprietyDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateEnderecoDto)
  endereco: UpdateEnderecoDto;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateContatoDto)
  contato: CreateContatoDto;
}
