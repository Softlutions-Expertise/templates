import { Injectable } from '@nestjs/common';
import { ArquivoDto } from '../../../helpers/dtos/arquivo.dto';
import { CreateEnderecoDto } from '../../../modules/base/dto/create-endereco.dto';
import { CreateColaboradorDto } from '../../../modules/pessoa/dto/create-colaborador.dto';
import { UpdateColaboradorDto } from '../../../modules/pessoa/dto/update-colaborador.dto';
import { NivelAcesso } from '../../../modules/pessoa/entities/enums/pessoa.enum';
import { ReportDto } from '../../../modules/report/dtos/report.dto';
import { IAuthzPolicy } from './interfaces/IAuthzPolicy';
import * as AuthStatements from './interfaces/IAuthzStatements';

type ISetStatements = {
  // Colaborador
  colaboradorCreate?: AuthStatements.IAuthzPolicyStatementColaboradorCreate['withResult'];
  colaboradorRead?: AuthStatements.IAuthzPolicyStatementColaboradorRead['filter'];
  colaboradorUpdate?: AuthStatements.IAuthzPolicyStatementColaboradorUpdate['filter'];
  colaboradorDelete?: AuthStatements.IAuthzPolicyStatementColaboradorDelete['filter'];
  // Pessoa
  pessoaRead?: AuthStatements.IAuthzPolicyStatementPessoaRead['filter'];
  // Arquivo
  arquivoRead?: AuthStatements.IAuthzPolicyStatementBaseArquivoRead['withResult'];
  // Relatório
  reportGenerate?: AuthStatements.IAuthzPolicyStatementReportGenerate['withResult'];
  // Endereço
  enderecoContext?: AuthStatements.IAuthzPolicyStatementEndereco['withResult'];
};

type ISetViewMenus = {
  colaborador?: {
    consultar?: boolean;
    cadastrar?: boolean;
  };
  pessoa?: {
    consultar?: boolean;
  };
  report?: boolean;
  features?: null | {
    integrations: boolean;
  };
};

@Injectable()
export class BaseAuthzPolicy implements IAuthzPolicy {
  name = 'authz-policy::base';

  async publicWhoAmI() {
    return {
      name: this.name,
    };
  }

  constructor() {
    this.setStatements(
      {
        colaboradorCreate: false,
        colaboradorRead: false,
        colaboradorUpdate: false,
        colaboradorDelete: false,
        pessoaRead: true,
        arquivoRead: true,
        reportGenerate: false,
        enderecoContext: false,
      },
      {
        colaborador: null,
        pessoa: null,
        features: {
          integrations: false,
        },
      },
    );
  }

  #statements: AuthStatements.IAuthzPolicyStatement[] = [];

  get statements() {
    return this.#statements;
  }

  setStatements(statements: ISetStatements, menus?: ISetViewMenus) {
    this.#statements = [];

    const mappings = [
      // Colaborador
      {
        kind: 'check',
        action: 'colaborador:create',
        withResult:
          statements.colaboradorCreate ??
          ((async (context) => {
            const qb = context.databaseContextService.colaboradorRepository
              .createQueryBuilder('colaborador')
              .innerJoin('colaborador.usuario', 'usuario')
              .select(['colaborador.id', 'usuario.id', 'usuario.nivelAcesso'])
              .where('usuario.nivelAcesso = :nivelAcessoAdministrador', {
                nivelAcessoAdministrador: NivelAcesso.Administrador,
              })
              .limit(1);

            const hasColaboradorAdministrador = await qb.getExists();
            const canAnonymousCreateColaborador = !hasColaboradorAdministrador;

            return canAnonymousCreateColaborador;
          }) as AuthStatements.IAuthzPolicyStatementColaboradorCreate['withResult']),
        getDtoClass: () => CreateColaboradorDto,
      },
      {
        kind: 'filter',
        action: 'colaborador:read',
        filter: statements.colaboradorRead ?? false,
      },
      {
        kind: 'filter',
        action: 'colaborador:update',
        filter: statements.colaboradorUpdate ?? false,
        getDtoClass: () => UpdateColaboradorDto,
      },
      {
        kind: 'filter',
        action: 'colaborador:delete',
        filter: statements.colaboradorDelete ?? false,
      },
      // Pessoa
      {
        kind: 'filter',
        action: 'pessoa:read',
        filter: statements.pessoaRead ?? true,
      },
      // Arquivo
      {
        kind: 'check',
        action: 'arquivo:read',
        withResult: statements.arquivoRead ?? true,
        getDtoClass: () => ArquivoDto,
      },
      // Relatório
      {
        kind: 'check',
        action: 'report:generate',
        withResult: statements.reportGenerate ?? false,
        getDtoClass: () => ReportDto,
      },
      // Endereço
      {
        kind: 'check',
        action: 'endereco:check',
        withResult: statements.enderecoContext ?? false,
        getDtoClass: () => CreateEnderecoDto,
      },
      // UI Menus - Colaborador
      {
        kind: 'check',
        action: 'ui:view:menu:colaborador:cadastrar',
        withResult: menus?.colaborador?.cadastrar ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:colaborador:consultar',
        withResult: menus?.colaborador?.consultar ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:colaborador',
        withResult: false,
      },
      // UI Menus - Pessoa
      {
        kind: 'check',
        action: 'ui:view:menu:pessoa:consultar',
        withResult: menus?.pessoa?.consultar ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:pessoa',
        withResult: false,
      },
      // UI Features
      {
        kind: 'check',
        action: 'ui:view:feature:integrations',
        withResult: menus?.features?.integrations ?? false,
      },
      // UI Report
      {
        kind: 'check',
        action: 'ui:view:menu:report',
        withResult: menus?.report ?? false,
      },
    ];

    const nestedMenus = [
      'ui:view:menu:colaborador',
      'ui:view:menu:pessoa',
    ];

    for (const nestedMenu of nestedMenus) {
      if (
        mappings.some(
          (i) => i.action.startsWith(`${nestedMenu}:`) && i.withResult,
        )
      ) {
        const mapping = mappings.find((i) => i.action === nestedMenu);
        mapping.withResult = true;
      }
    }

    for (const mapping of mappings) {
      if (mapping.kind === 'check') {
        if (mapping.withResult !== undefined) {
          this.#statements.push(
            mapping as AuthStatements.IAuthzPolicyStatementCheck,
          );
        }
      }

      if (mapping.kind === 'filter') {
        if (mapping.filter !== undefined) {
          this.#statements.push(
            mapping as AuthStatements.IAuthzPolicyStatementFilter,
          );
        }
      }
    }
  }
}
