import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { GetDoc } from '../../../helpers/decorators/swagger.decorator';
import { Roles } from '../../../helpers/enums/role.enum';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../../infrastructure/acesso-control/decorators';
import { ArquivoService } from '../../../infrastructure/arquivo/arquivo.service';

@ApiTags('Base')
@Controller('base/arquivos')
export class ArquivosController {
  constructor(private readonly arquivo: ArquivoService) {}
  @Get(':accessToken')
  @GetDoc(
    'Base',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.GestorDeCreche,
      Roles.Defensoria,
    ].join(', '),
    ['accessToken'],
  )
  async downloadFile(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('accessToken') accessToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await acessoControl.ensureCanPerform('arquivo:read', { accessToken });

    const uploadedFile = await this.arquivo.getUploadedFileByAccessToken(
      acessoControl,
      accessToken,
    );

    if (!uploadedFile) {
      throw new NotFoundException('arquivo não encontrado');
    }

    const { stream, headers } = uploadedFile;

    res.set({
      'Content-Type': headers['Content-Type'],
      'Content-Disposition': headers['Content-Disposition'],
      'Cache-Control': 'private, max-age=7200, stale-while-revalidate=7200',
    });

    return new StreamableFile(stream);
  }
}
