import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { GetDoc } from '../../helpers/decorators/swagger.decorator';
import { Roles } from '../../helpers/enums/role.enum';
import { NeedsAuth } from '../../infrastructure';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../infrastructure/acesso-control/decorators';
import { FeriadosService } from './feriados.service';

@ApiTags('Feriados')
@Controller('/base/feriados')
export class FeriadosController {
  constructor(private feriadosService: FeriadosService) { }

  @NeedsAuth()
  @Get('/')
  @GetDoc(
    'Feriados',
    [
      Roles.Administrador,
      Roles.AdministradorMunicipal,
      Roles.AtendenteSecretaria,
      Roles.Defensoria,
      Roles.GestorDeCreche,
    ].join(', '),
    [
      'page',
      'search',
      'limit',

      'filter.id',
      'filter.estado.id',
      'filter.cidade.id',
      'filter.data',

      //
      'atingeAno',
      'atingeEstado',
      'atingeCidade',

      'atingeSecretaria',
    ],
  )
  findAll(
    @ResolveAcessoControl() acessoControl: AcessoControl,

    @Paginate() query: PaginateQuery,

    @Query('atingeAno', new ParseIntPipe({ optional: false }))
    atingeAno: number,

    @Query('atingeEstado')
    atingeEstado: number | null,

    @Query('atingeCidade')
    atingeCidade: number | null,

    @Query('atingeSecretaria')
    atingeSecretaria: string | null,
  ) {
    return this.feriadosService.findAll(acessoControl, query, {
      atingeAno,
      atingeCidade,
      atingeEstado,
      atingeSecretaria,
    });
  }
}
