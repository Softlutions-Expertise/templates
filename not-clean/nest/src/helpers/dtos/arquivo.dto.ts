import { IsString } from 'class-validator';

export class ArquivoDto {
  @IsString()
  accessToken: string;
}
