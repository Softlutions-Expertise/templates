import { Injectable } from '@nestjs/common';
import { ArquivoDto } from '../../../helpers/dtos/arquivo.dto';
import { CreateEnderecoDto } from '../../../modules/base/dto/create-endereco.dto';
import { ConfigurarCriteriosDto } from '../../../modules/configuracao-criterio/dtos/ConfigurarCriteriosDto';
import { CreateCriteriosDto } from '../../../modules/entrevista/dto/create-criterios';
import { CreateEntrevistaDto } from '../../../modules/entrevista/dto/create-entrevista.dto';
import { CreateRegistrarContatoDto } from '../../../modules/entrevista/dto/create-registrar-contato.dto';
import { UpdateCriteriosDto } from '../../../modules/entrevista/dto/update-criterios';
import { UpdateEntrevistaDto } from '../../../modules/entrevista/dto/update-entrevista.dto';
import { UpdateRegistrarContatoDto } from '../../../modules/entrevista/dto/update-registrar-contatos.dto';
import { CreateEscolaDto } from '../../../modules/escola/dto/create-escola.dto';
import { CreateTurmaDto } from '../../../modules/escola/dto/create-turma.dto';
import { CreateVagasDto } from '../../../modules/escola/dto/create-vagas.dto';
import { UpdateEscolaDto } from '../../../modules/escola/dto/update-escola.dto';
import { UpdateTurmaDto } from '../../../modules/escola/dto/update-turma.dto';
import { UpdateVagasDto } from '../../../modules/escola/dto/update-vagas.dto';
import { CreateCriancaDto } from '../../../modules/pessoa/dto/create-crianca.dto';
import { CreateFuncionarioDto } from '../../../modules/pessoa/dto/create-funcionario.dto';
import { UpdateCriancaDto } from '../../../modules/pessoa/dto/update-crianca.dto';
import { UpdateFuncionarioDto } from '../../../modules/pessoa/dto/update-funcionario.dto';
import { NivelAcesso } from '../../../modules/pessoa/entities/enums/pessoa.enum';
import { ReportDto } from '../../../modules/report/dtos/report.dto';
import { CreateReservaVagaDto } from '../../../modules/reserva-vaga/dto/create-reserva-vaga.dto';
import { UpdateReservaVagaStatusDto } from '../../../modules/reserva-vaga/dto/update-reserva-vaga-status.dto';
import { UpdateReservaVagaDto } from '../../../modules/reserva-vaga/dto/update-reserva-vaga.dto';
import { CreateSecretariaMunicipalDto } from '../../../modules/secretaria-municipal/dto/create-secretaria-municipal.dto';
import { UpdateSecretariaMunicipalDto } from '../../../modules/secretaria-municipal/dto/update-secretaria-municipal.dto';
import { IAuthzPolicy } from './interfaces/IAuthzPolicy';
import * as AuthStatements from './interfaces/IAuthzStatements';

type ISetStatements = {
  feriadoRead?: AuthStatements.IAuthzPolicyStatementFeriadoRead['withResult'];

  //
  integrationAccessTokenCreate?: AuthStatements.IAuthzPolicyStatementIntegrationAccessTokenCreate['withResult'];
  integrationAccessTokenRead?: AuthStatements.IAuthzPolicyStatementIntegrationAccessTokenRead['filter'];
  integrationAccessTokenUpdate?: AuthStatements.IAuthzPolicyStatementIntegrationAccessTokenUpdate['filter'];
  integrationAccessTokenDelete?: AuthStatements.IAuthzPolicyStatementIntegrationAccessTokenDelete['filter'];

  //
  secretariaCreate?: AuthStatements.IAuthzPolicyStatementSecretariaCreate['withResult'];
  secretariaRead?: AuthStatements.IAuthzPolicyStatementSecretariaRead['filter'];
  secretariaUpdate?: AuthStatements.IAuthzPolicyStatementSecretariaUpdate['filter'];
  secretariaDelete?: AuthStatements.IAuthzPolicyStatementSecretariaDelete['filter'];
  //
  agendamentoCreate?: AuthStatements.IAuthzPolicyStatementEscolaCreate['withResult'];
  agendamentoRead?: AuthStatements.IAuthzPolicyStatementEscolaRead['filter'];
  agendamentoUpdate?: AuthStatements.IAuthzPolicyStatementEscolaUpdate['filter'];
  agendamentoDelete?: AuthStatements.IAuthzPolicyStatementEscolaDelete['filter'];
  //
  escolaCreate?: AuthStatements.IAuthzPolicyStatementEscolaCreate['withResult'];
  escolaRead?: AuthStatements.IAuthzPolicyStatementEscolaRead['filter'];
  escolaUpdate?: AuthStatements.IAuthzPolicyStatementEscolaUpdate['filter'];
  escolaDelete?: AuthStatements.IAuthzPolicyStatementEscolaDelete['filter'];
  //
  secretariaCriteriosRead?: AuthStatements.IAuthzPolicyStatementSecretariaCriteriosRead['filter'];
  secretariaCriteriosChange?: AuthStatements.IAuthzPolicyStatementSecretariaCriteriosChange['filter'];
  //
  secretariaGerenciaAgendamentoRead?: AuthStatements.IAuthzPolicyStatementSecretariaGerenciaAgendamentoRead['filter'];
  secretariaGerenciaAgendamentoUpdate?: AuthStatements.IAuthzPolicyStatementSecretariaGerenciaAgendamentoChange['filter'];
  //
  servidorCreate?: AuthStatements.IAuthzPolicyStatementServidorCreate['withResult'];
  servidorRead?: AuthStatements.IAuthzPolicyStatementServidorRead['filter'];
  servidorUpdate?: AuthStatements.IAuthzPolicyStatementServidorUpdate['filter'];
  servidorDelete?: AuthStatements.IAuthzPolicyStatementServidorDelete['filter'];
  //
  turmaCreate?: AuthStatements.IAuthzPolicyStatementTurmaCreate['withResult'];
  turmaRead?: AuthStatements.IAuthzPolicyStatementTurmaRead['filter'];
  turmaUpdate?: AuthStatements.IAuthzPolicyStatementTurmaUpdate['filter'];
  turmaDelete?: AuthStatements.IAuthzPolicyStatementTurmaDelete['filter'];
  //
  criterioCreate?: AuthStatements.IAuthzPolicyStatementCriterioCreate['withResult'];
  criterioRead?: AuthStatements.IAuthzPolicyStatementCriterioRead['filter'];
  criterioUpdate?: AuthStatements.IAuthzPolicyStatementCriterioUpdate['filter'];
  criterioDelete?: AuthStatements.IAuthzPolicyStatementCriterioDelete['filter'];
  //
  registroVagaCreate?: AuthStatements.IAuthzPolicyStatementRegistroVagaCreate['withResult'];
  registroVagaRead?: AuthStatements.IAuthzPolicyStatementRegistroVagaRead['filter'];
  //
  vagaCreate?: AuthStatements.IAuthzPolicyStatementVagaCreate['withResult'];
  vagaRead?: AuthStatements.IAuthzPolicyStatementVagaRead['filter'];
  vagaUpdate?: AuthStatements.IAuthzPolicyStatementVagaUpdate['filter'];
  vagaDelete?: AuthStatements.IAuthzPolicyStatementVagaDelete['filter'];
  //
  reservaVagaCreate?: AuthStatements.IAuthzPolicyStatementReservaVagaCreate['withResult'];
  reservaVagaRead?: AuthStatements.IAuthzPolicyStatementReservaVagaRead['filter'];
  reservaVagaUpdate?: AuthStatements.IAuthzPolicyStatementReservaVagaUpdate['filter'];
  reservaVagaUpdateStatus?: AuthStatements.IAuthzPolicyStatementReservaVagaUpdateStatus['filter'];
  reservaVagaDelete?: AuthStatements.IAuthzPolicyStatementReservaVagaDelete['filter'];
  //
  criancaCreate?: AuthStatements.IAuthzPolicyStatementCriancaCreate['withResult'];
  criancaRead?: AuthStatements.IAuthzPolicyStatementCriancaRead['filter'];
  criancaUpdate?: AuthStatements.IAuthzPolicyStatementCriancaUpdate['filter'];
  criancaDelete?: AuthStatements.IAuthzPolicyStatementCriancaDelete['filter'];
  //
  entrevistaCreate?: AuthStatements.IAuthzPolicyStatementEntrevistaCreate['withResult'];
  entrevistaRead?: AuthStatements.IAuthzPolicyStatementEntrevistaRead['filter'];
  entrevistaUpdate?: AuthStatements.IAuthzPolicyStatementEntrevistaUpdate['filter'];
  entrevistaDelete?: AuthStatements.IAuthzPolicyStatementEntrevistaDelete['filter'];
  //
  registroContatoCreate?: AuthStatements.IAuthzPolicyStatementRegistroContatoCreate['withResult'];
  registroContatoRead?: AuthStatements.IAuthzPolicyStatementRegistroContatoRead['filter'];
  registroContatoUpdate?: AuthStatements.IAuthzPolicyStatementRegistroContatoUpdate['filter'];
  registroContatoDelete?: AuthStatements.IAuthzPolicyStatementRegistroContatoDelete['filter'];
  //
  arquivoRead?: AuthStatements.IAuthzPolicyStatementBaseArquivoRead['withResult'];
  //
  filaRead?: AuthStatements.IAuthzPolicyStatementFilaRead['filter'];
  //
  etapaRead?: AuthStatements.IAuthzPolicyStatementEtapaRead['filter'];
  //
  reportContext?: AuthStatements.IAuthzPolicyStatementReport['withResult'];
  //
  enderecoContext?: AuthStatements.IAuthzPolicyStatementEndereco['withResult'];
};

type ISetViewMenus = {
  agendamento?: {
    calendario?: boolean;
    gerenciar?: boolean;
    consultar?: boolean;
  };

  entrevista?: {
    entrevistar?: boolean;
    consultar?: boolean;
  };

  criterios?: {
    gerenciar?: boolean;
    consultar?: boolean;
  };

  consulta?: null | {
    secretaria?: boolean;
    escola?: boolean;
    turma?: boolean;
    vaga?: boolean;
    reservaVaga?: boolean;
    crianca?: boolean;
    servidor?: boolean;
  };

  cadastro?: null | {
    secretaria?: boolean;
    escola?: boolean;
    turma?: boolean;
    vaga?: boolean;
    crianca?: boolean;
    servidor?: boolean;
  };

  reservaVaga?: null | {
    updateStatus?: null | boolean;
  };

  fila?: null | {
    itemReservarVaga: boolean;
    itemFazerContato: boolean;
  };

  report?: boolean;

  features?: null | {
    integrations: boolean;
  };
};

@Injectable()
export class BaseAuthzPolicy implements IAuthzPolicy {
  name = 'authz-policy::base';

  //

  async publicWhoAmI() {
    return {
      name: this.name,
    };
  }

  constructor() {
    this.setStatements(
      {
        feriadoRead: false,

        secretariaCreate: false,
        secretariaRead: true,
        secretariaUpdate: false,
        secretariaDelete: false,
        //
        escolaCreate: false,
        escolaRead: true,
        escolaUpdate: false,
        escolaDelete: false,
        //
        agendamentoCreate: true,
        agendamentoRead: false,
        agendamentoUpdate: true,
        agendamentoDelete: true,
        //
        secretariaCriteriosRead: true,
        secretariaCriteriosChange: false,
        //
        secretariaGerenciaAgendamentoRead: true,
        secretariaGerenciaAgendamentoUpdate: false,
        //
        turmaCreate: false,
        turmaRead: false,
        turmaUpdate: false,
        turmaDelete: false,
        //
        criterioCreate: false,
        criterioRead: true,
        criterioUpdate: false,
        criterioDelete: false,
        //
        registroVagaCreate: false,
        registroVagaRead: false,
        //
        vagaCreate: false,
        vagaRead: false,
        vagaUpdate: false,
        vagaDelete: false,
        //
        criancaCreate: false,
        criancaRead: false,
        criancaUpdate: false,
        criancaDelete: false,

        //
        reservaVagaCreate: false,
        reservaVagaRead: false,
        reservaVagaUpdate: false,
        reservaVagaUpdateStatus: false,
        reservaVagaDelete: false,
        //
        arquivoRead: true,
        //
        filaRead: false,
        //
        etapaRead: false,
        //
        reportContext: false,
        //
        enderecoContext: false,
      },
      {
        agendamento: null,
        criterios: null,
        cadastro: null,
        consulta: null,
        fila: null,
        features: {
          integrations: false,
        },
      },
    );
  }

  //

  #statements: AuthStatements.IAuthzPolicyStatement[] = [];

  get statements() {
    return this.#statements;
  }

  //

  setStatements(statements: ISetStatements, menus?: ISetViewMenus) {
    this.#statements = [];

    const mappings = [
      {
        kind: 'check',
        action: 'feriado:read',
        withResult: statements.feriadoRead ?? false,
      },
      {
        kind: 'check',
        action: 'integration_access_token:create',
        withResult: statements.integrationAccessTokenCreate ?? false,
        getDtoClass: () => CreateSecretariaMunicipalDto,
      },
      {
        kind: 'filter',
        action: 'integration_access_token:read',
        filter: statements.integrationAccessTokenRead ?? false,
      },
      {
        kind: 'filter',
        action: 'integration_access_token:update',
        filter: statements.integrationAccessTokenUpdate ?? false,
        getDtoClass: () => UpdateSecretariaMunicipalDto,
      },
      {
        kind: 'filter',
        action: 'integration_access_token:delete',
        filter: statements.integrationAccessTokenDelete ?? false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'secretaria:create',
        withResult: statements.secretariaCreate ?? false,
        getDtoClass: () => CreateSecretariaMunicipalDto,
      },
      {
        kind: 'filter',
        action: 'secretaria:read',
        filter: statements.secretariaRead ?? true,
      },
      {
        kind: 'filter',
        action: 'secretaria:update',
        filter: statements.secretariaUpdate ?? false,
        getDtoClass: () => UpdateSecretariaMunicipalDto,
      },
      {
        kind: 'filter',
        action: 'secretaria:delete',
        filter: statements.secretariaDelete ?? false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'escola:create',
        withResult: statements.escolaCreate ?? false,
        getDtoClass: () => CreateEscolaDto,
      },
      {
        kind: 'filter',
        action: 'escola:read',
        filter: statements.escolaRead ?? false,
      },
      {
        kind: 'filter',
        action: 'escola:update',
        filter: statements.escolaUpdate ?? false,
        getDtoClass: () => UpdateEscolaDto,
      },
      {
        kind: 'filter',
        action: 'escola:delete',
        filter: statements.escolaDelete ?? false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'agendamento:create',
        withResult: statements.agendamentoCreate ?? true,
        getDtoClass: () => CreateEscolaDto,
      },
      {
        kind: 'filter',
        action: 'agendamento:read',
        filter: statements.agendamentoRead ?? false,
      },
      {
        kind: 'filter',
        action: 'agendamento:update',
        filter: statements.agendamentoUpdate ?? true,
        getDtoClass: () => UpdateEscolaDto,
      },
      {
        kind: 'filter',
        action: 'agendamento:delete',
        filter: statements.agendamentoDelete ?? true,
      },
      // =========================================================
      {
        kind: 'filter',
        action: 'secretaria:criterios:read',
        filter: statements.secretariaCriteriosRead ?? false,
      },
      {
        kind: 'filter',
        action: 'secretaria:criterios:change',
        filter: statements.secretariaCriteriosChange ?? false,
        getDtoClass: () => ConfigurarCriteriosDto,
      },
      // =========================================================
      {
        kind: 'filter',
        action: 'secretaria:gerencia_agendamento:read',
        filter: statements.secretariaGerenciaAgendamentoRead ?? true,
      },
      {
        kind: 'filter',
        action: 'secretaria:gerencia_agendamento:update',
        filter: statements.secretariaGerenciaAgendamentoUpdate ?? false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'servidor:create',
        withResult:
          statements.servidorCreate ??
          ((async (context) => {
            const qb = context.databaseContextService.funcionarioRepository
              .createQueryBuilder('funcionario')
              .innerJoin('funcionario.usuario', 'usuario')
              .select(['funcionario.id', 'usuario.id', 'usuario.nivelAcesso'])
              .where('usuario.nivelAcesso = :nivelAcessoAdministrador', {
                nivelAcessoAdministrador: NivelAcesso.Administrador,
              })
              .limit(1);

            const hasFuncionarioAdministrador = await qb.getExists();

            const canAnonymousCreateFuncionario = !hasFuncionarioAdministrador;

            return canAnonymousCreateFuncionario;
          }) as AuthStatements.IAuthzPolicyStatementServidorCreate['withResult']),
        getDtoClass: () => CreateFuncionarioDto,
      },
      {
        kind: 'filter',
        action: 'servidor:read',
        filter: statements.servidorRead ?? false,
      },
      {
        kind: 'filter',
        action: 'servidor:update',
        filter: statements.servidorUpdate ?? false,
        getDtoClass: () => UpdateFuncionarioDto,
      },
      {
        kind: 'filter',
        action: 'servidor:delete',
        filter: statements.servidorDelete ?? false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'criterio:create',
        withResult: statements.criterioCreate ?? false,
        getDtoClass: () => CreateCriteriosDto,
      },
      {
        kind: 'filter',
        action: 'criterio:read',
        filter: statements.criterioRead ?? false,
      },
      {
        kind: 'filter',
        action: 'criterio:update',
        filter: statements.criterioUpdate ?? false,
        getDtoClass: () => UpdateCriteriosDto,
      },
      {
        kind: 'filter',
        action: 'criterio:delete',
        filter: statements.criterioDelete ?? false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'turma:create',
        withResult: statements.turmaCreate ?? false,
        getDtoClass: () => CreateTurmaDto,
      },
      {
        kind: 'filter',
        action: 'turma:read',
        filter: statements.turmaRead ?? false,
      },
      {
        kind: 'filter',
        action: 'turma:update',
        filter: statements.turmaUpdate ?? false,
        getDtoClass: () => UpdateTurmaDto,
      },
      {
        kind: 'filter',
        action: 'turma:delete',
        filter: statements.turmaDelete ?? false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'registro_vaga:create',
        withResult: statements.registroVagaCreate ?? false,
        getDtoClass: () => CreateVagasDto,
      },
      {
        kind: 'filter',
        action: 'registro_vaga:read',
        filter: statements.registroVagaRead ?? false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'vaga:create',
        withResult: statements.vagaCreate ?? false,
        getDtoClass: () => CreateVagasDto,
      },
      {
        kind: 'filter',
        action: 'vaga:read',
        filter: statements.vagaRead ?? false,
      },
      {
        kind: 'filter',
        action: 'vaga:update',
        filter: statements.vagaUpdate ?? false,
        getDtoClass: () => UpdateVagasDto,
      },
      {
        kind: 'filter',
        action: 'vaga:delete',
        filter: statements.vagaDelete ?? false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'reserva_vaga:create',
        withResult: statements.reservaVagaCreate ?? false,
        getDtoClass: () => CreateReservaVagaDto,
      },
      {
        kind: 'filter',
        action: 'reserva_vaga:read',
        filter: statements.reservaVagaRead ?? false,
      },
      {
        kind: 'filter',
        action: 'reserva_vaga:update',
        filter: statements.reservaVagaUpdate ?? false,
        getDtoClass: () => UpdateReservaVagaDto,
      },
      {
        kind: 'filter',
        action: 'reserva_vaga:update:status',
        filter: statements.reservaVagaUpdateStatus ?? false,
        getDtoClass: () => UpdateReservaVagaStatusDto,
      },
      {
        kind: 'filter',
        action: 'reserva_vaga:delete',
        filter: statements.reservaVagaDelete ?? false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'crianca:create',
        withResult: statements.criancaCreate ?? false,
        getDtoClass: () => CreateCriancaDto,
      },
      {
        kind: 'filter',
        action: 'crianca:read',
        filter: statements.criancaRead ?? true,
      },
      {
        kind: 'filter',
        action: 'crianca:update',
        filter: statements.criancaUpdate ?? false,
        getDtoClass: () => UpdateCriancaDto,
      },
      {
        kind: 'filter',
        action: 'crianca:delete',
        filter: statements.criancaDelete ?? false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'entrevista:create',
        withResult: statements.entrevistaCreate ?? false,
        getDtoClass: () => CreateEntrevistaDto,
      },
      {
        kind: 'filter',
        action: 'entrevista:read',
        filter: statements.entrevistaRead ?? false,
      },
      {
        kind: 'filter',
        action: 'entrevista:update',
        filter: statements.entrevistaUpdate ?? false,
        getDtoClass: () => UpdateEntrevistaDto,
      },
      {
        kind: 'filter',
        action: 'entrevista:delete',
        filter: statements.entrevistaDelete ?? false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'registro_contato:create',
        withResult: statements.registroContatoCreate ?? false,
        getDtoClass: () => CreateRegistrarContatoDto,
      },
      {
        kind: 'filter',
        action: 'registro_contato:read',
        filter: statements.registroContatoRead ?? false,
      },
      {
        kind: 'filter',
        action: 'registro_contato:update',
        filter: statements.registroContatoUpdate ?? false,
        getDtoClass: () => UpdateRegistrarContatoDto,
      },
      {
        kind: 'filter',
        action: 'registro_contato:delete',
        filter: statements.registroContatoDelete ?? false,
      },
      {
        kind: 'check',
        action: 'arquivo:read',
        withResult: statements.arquivoRead ?? true,
        getDtoClass: () => ArquivoDto,
      },
      {
        kind: 'filter',
        action: 'fila:read',
        filter: statements.filaRead ?? false,
      },
      // =========================================================
      {
        kind: 'filter',
        action: 'etapa:read',
        filter: statements.etapaRead ?? false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'report:check',
        withResult: statements.reportContext ?? false,
        getDtoClass: () => ReportDto,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'endereco:check',
        withResult: statements.enderecoContext ?? false,
        getDtoClass: () => CreateEnderecoDto,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'ui:view:menu:cadastro:secretaria',
        withResult: menus?.cadastro?.secretaria ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:cadastro:escola',
        withResult: menus?.cadastro?.escola ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:cadastro:turma',
        withResult: menus?.cadastro?.turma ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:cadastro:vaga',
        withResult: menus?.cadastro?.vaga ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:cadastro:crianca',
        withResult: menus?.cadastro?.crianca ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:cadastro:servidor',
        withResult: menus?.cadastro?.servidor ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:cadastro',
        withResult: false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'ui:view:menu:consulta:secretaria',
        withResult: menus?.consulta?.secretaria ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:consulta:escola',
        withResult: menus?.consulta?.escola ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:consulta:turma',
        withResult: menus?.consulta?.turma ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:consulta:vaga',
        withResult: menus?.consulta?.vaga ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:consulta:reserva_vaga',
        withResult: menus?.consulta?.reservaVaga ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:consulta:crianca',
        withResult: menus?.consulta?.crianca ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:consulta:servidor',
        withResult: menus?.consulta?.servidor ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:consulta',
        withResult: false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'ui:view:menu:criterios:gerenciar',
        withResult: menus?.criterios?.gerenciar ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:criterios:consultar',
        withResult: menus?.criterios?.consultar ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:criterios',
        withResult: false,
      },
      // =========================================================
      {
        kind: 'check',
        action: 'ui:view:menu:agendamento:calendario',
        withResult: menus?.agendamento?.calendario ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:agendamento:consultar',
        withResult: menus?.agendamento?.consultar ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:agendamento:gerenciar',
        withResult: menus?.agendamento?.gerenciar ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:agendamento',
        withResult: true,
      },
      // ======================
      {
        kind: 'check',
        action: 'ui:view:menu:entrevista:consultar',
        withResult: menus?.entrevista?.consultar ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:entrevista:entrevistar',
        withResult: menus?.entrevista?.entrevistar ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:menu:entrevista',
        withResult: false,
      },
      // ======================
      {
        kind: 'check',
        action: 'ui:view:reserva_vaga:update:status',
        withResult: menus?.reservaVaga?.updateStatus ?? false,
      },
      // ======================
      {
        kind: 'check',
        action: 'ui:view:menu:fila',
        withResult: Boolean(menus?.fila),
      },
      {
        kind: 'check',
        action: 'ui:view:fila:item:reservar_vaga',
        withResult: menus?.fila?.itemReservarVaga ?? false,
      },
      {
        kind: 'check',
        action: 'ui:view:fila:item:fazer_contato',
        withResult: menus?.fila?.itemFazerContato ?? false,
      },
      // ======================
      {
        kind: 'check',
        action: 'ui:view:feature:integrations',
        withResult: menus?.features?.integrations ?? false,
      },
      // ======================
      {
        kind: 'check',
        action: 'ui:view:menu:report',
        withResult: menus?.report ?? false,
      },
    ];

    const nestedMenus = [
      'ui:view:menu:entrevista',
      'ui:view:menu:agendamento',
      'ui:view:menu:criterios',
      'ui:view:menu:consulta',
      'ui:view:menu:cadastro',
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

  //
}
