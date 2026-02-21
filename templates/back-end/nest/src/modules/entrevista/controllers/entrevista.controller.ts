import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post, Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import {
  DeleteDoc,
  GetDoc,
  PatchDoc,
  PostDoc,
} from '../../../helpers/decorators/swagger.decorator';
import { Roles } from '../../../helpers/enums/role.enum';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../../infrastructure/acesso-control/decorators/resolve-acesso-control.decorator';
import { CreateEntrevistaDto } from '../dto/create-entrevista.dto';
import { UpdateEntrevistaElegivelFilaDto } from '../dto/update-entrevista-elegivel-fila.dto';
import { UpdateEntrevistaDto } from '../dto/update-entrevista.dto';
import {
  EntrevistaService,
  IEntrevistaComMetadata,
} from '../services/entrevista.service';

@ApiTags('Entrevista')
@Controller('/entrevista')
export class EntrevistaController {
  constructor(private readonly entrevistaService: EntrevistaService) {}

  @Get(':id')
  @GetDoc(
    'Entrevista',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
    ].join(', '),
  )
  findOne(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.entrevistaService.findOne(acessoControl, id);
  }

  @Get('/consultar/:criancaId/secretaria/:secretariaId')
  @GetDoc(
    'Entrevista',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
    ].join(', '),
  )
  checarCriancaPodeSerAtribuidaNaEntrevista(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('criancaId', new ParseUUIDPipe()) criancaId: string,
    @Param('secretariaId', new ParseUUIDPipe()) secretariaId: string,
  ) {
    return this.entrevistaService.checarCriancaPodeSerAtribuidaNaEntrevista(
      acessoControl,
      criancaId,
      null,
      secretariaId,
    );
  }

  @Get('/consultar/:criancaId/:entrevistaId')
  @GetDoc(
    'Entrevista',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
    ].join(', '),
  )
  checarCriancaPodeSerAtribuidaNaEntrevistaByCurrentEntrevista(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('criancaId', new ParseUUIDPipe()) criancaId: string,
    @Param('entrevistaId', new ParseUUIDPipe())
    entrevistaId: string,
  ) {
    return this.entrevistaService.checarCriancaPodeSerAtribuidaNaEntrevista(
      acessoControl,
      criancaId,
      entrevistaId,
    );
  }

  @Get()
  @GetDoc(
    'Entrevista',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
    ].join(', '),
    [
      'search',
      'filter.crianca.cpf',
      'filter.secretariaMunicipal.id',
      'filter.etapa.id',
      'filter.preferenciaUnidade',
      'filter.preferenciaTurno',
      {
        name: 'filter.vagaConcedida',
        type: Boolean,
        required: false,
      },
      {
        name: 'incluirTudo',
        type: Boolean,
        required: false,
      }
    ],
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Paginate() query: PaginateQuery,
    @Query('incluirTudo') incluirTudo?: string,
  ): Promise<Paginated<IEntrevistaComMetadata>> {
    return this.entrevistaService.findAll(acessoControl, query, incluirTudo === 'true');
  }

  @Post()
  @PostDoc(
    'Entrevista',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
    ].join(', '),
    CreateEntrevistaDto,
  )
  create(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Body() data: CreateEntrevistaDto,
  ) {
    return this.entrevistaService.create(acessoControl, data);
  }

  @Patch(':id')
  @PatchDoc(
    'Entrevista',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
    ].join(', '),
    UpdateEntrevistaDto,
  )
  update(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() data: UpdateEntrevistaDto,
  ) {
    return this.entrevistaService.update(acessoControl, id, data);
  }

  @Delete(':id')
  @DeleteDoc(
    'Entrevista',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
    ].join(', '),
  )
  remove(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
  ) {
    return this.entrevistaService.remove(acessoControl, id);
  }

  @Post('/elegivel-fila/:id')
  @PostDoc(
    'Entrevista',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
    ].join(', '),
    UpdateEntrevistaElegivelFilaDto,
  )
  updateElegivelFila(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('id') id: string,
    @Body() dto: UpdateEntrevistaElegivelFilaDto,
  ) {
    return this.entrevistaService.updateElegivelFila(acessoControl, id, dto);
  }

  @Get('/download-arquivos-criterios-zip/:entrevistaId')
  @GetDoc(
    'Entrevista',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
    ].join(', '),
  )
  async downloadArquivosCriteriosZip(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('entrevistaId', new ParseUUIDPipe()) entrevistaId: string,
    @Res() res: Response,
  ) {
    const zipStream = await this.entrevistaService.downloadArquivosCriteriosZip(
      null,
      entrevistaId,
    );

    if (!zipStream) {
      return res
        .status(404)
        .json({ message: 'Nenhum arquivo disponível para download' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="criterios-entrevista-${entrevistaId}.zip"`,
    );

    zipStream.pipe(res);
  }


  @Get('/findAllEntrevistadoresBySecretariaId/:secretariaId')
  @GetDoc(
    'Entrevista',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
    ].join(', '),

  )
  async findAllEntrevistadoresBySecretariaId(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('secretariaId', new ParseUUIDPipe()) secretariaId: string,
  ){
    return this.entrevistaService.findAllEntrevistadoresBySecretariaId(
      acessoControl,
      secretariaId,
    );
  }

}
