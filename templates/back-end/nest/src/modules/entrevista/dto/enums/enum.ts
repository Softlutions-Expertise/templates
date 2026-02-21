import { ApiProperty } from '@nestjs/swagger';

export class Criterios {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ativo: boolean;

  @ApiProperty()
  arquivo: string;

  @ApiProperty()
  nomeArquivo: string;

  @ApiProperty()
  tipoArquivo: string;

  @ApiProperty()
  nameSizeFile: string;

  @ApiProperty()
  byteString: string;
}
