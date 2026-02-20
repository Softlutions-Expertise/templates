import { ArquivoDto } from '../../../../helpers/dtos/arquivo.dto';
import { CreateAgendamentoDto } from '../../../../modules/agendamento/dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from '../../../../modules/agendamento/dto/update-agendamento.dto';
import { CreateEnderecoDto } from '../../../../modules/base/dto/create-endereco.dto';
import { ConfigurarCriteriosDto } from '../../../../modules/configuracao-criterio/dtos/ConfigurarCriteriosDto';
import { CreateCriteriosDto } from '../../../../modules/entrevista/dto/create-criterios';
import { CreateEntrevistaDto } from '../../../../modules/entrevista/dto/create-entrevista.dto';
import { CreateRegistrarContatoDto } from '../../../../modules/entrevista/dto/create-registrar-contato.dto';
import { UpdateCriteriosDto } from '../../../../modules/entrevista/dto/update-criterios';
import { UpdateEntrevistaDto } from '../../../../modules/entrevista/dto/update-entrevista.dto';
import { UpdateRegistrarContatoDto } from '../../../../modules/entrevista/dto/update-registrar-contatos.dto';
import { CreateEscolaDto } from '../../../../modules/escola/dto/create-escola.dto';
import { CreateRegistroVagasDto } from '../../../../modules/escola/dto/create-registro-vagas.dto';
import { CreateTurmaDto } from '../../../../modules/escola/dto/create-turma.dto';
import { CreateVagasDto } from '../../../../modules/escola/dto/create-vagas.dto';
import { UpdateEscolaDto } from '../../../../modules/escola/dto/update-escola.dto';
import { UpdateTurmaDto } from '../../../../modules/escola/dto/update-turma.dto';
import { UpdateVagasDto } from '../../../../modules/escola/dto/update-vagas.dto';
import { CreateIntegrationAccessTokenDto } from '../../../../modules/integrations/integration-access-token/dto/create-integration-access-token.dto';
import { UpdateIntegrationAccessTokenDto } from '../../../../modules/integrations/integration-access-token/dto/update-integration-access-token.dto';
import { CreateCriancaDto } from '../../../../modules/pessoa/dto/create-crianca.dto';
import { CreateFuncionarioDto } from '../../../../modules/pessoa/dto/create-funcionario.dto';
import { UpdateCriancaDto } from '../../../../modules/pessoa/dto/update-crianca.dto';
import { UpdateFuncionarioDto } from '../../../../modules/pessoa/dto/update-funcionario.dto';
import { ReportDto } from '../../../../modules/report/dtos/report.dto';
import { CreateReservaVagaDto } from '../../../../modules/reserva-vaga/dto/create-reserva-vaga.dto';
import { UpdateReservaVagaStatusDto } from '../../../../modules/reserva-vaga/dto/update-reserva-vaga-status.dto';
import { UpdateReservaVagaDto } from '../../../../modules/reserva-vaga/dto/update-reserva-vaga.dto';
import {
  IAuthzPolicyStatementKindCheck,
  IAuthzPolicyStatementKindFilter,
} from './IAuthzBaseStatement';

// ==============================================================================

export type IAuthzPolicyStatementIntegrationAccessTokenCreate =
  IAuthzPolicyStatementKindCheck<
    'integration_access_token:create',
    CreateIntegrationAccessTokenDto
  >;

export type IAuthzPolicyStatementIntegrationAccessTokenRead =
  IAuthzPolicyStatementKindFilter<'integration_access_token:read'>;

export type IAuthzPolicyStatementIntegrationAccessTokenUpdate =
  IAuthzPolicyStatementKindFilter<
    'integration_access_token:update',
    UpdateIntegrationAccessTokenDto
  >;

export type IAuthzPolicyStatementIntegrationAccessTokenDelete =
  IAuthzPolicyStatementKindFilter<'integration_access_token:delete'>;

// ======================================================================

// ==============================================================================

export type IAuthzPolicyStatementSecretariaCreate =
  IAuthzPolicyStatementKindCheck<'secretaria:create'>;

export type IAuthzPolicyStatementSecretariaRead =
  IAuthzPolicyStatementKindFilter<'secretaria:read'>;

export type IAuthzPolicyStatementSecretariaUpdate =
  IAuthzPolicyStatementKindFilter<'secretaria:update'>;

export type IAuthzPolicyStatementSecretariaDelete =
  IAuthzPolicyStatementKindFilter<'secretaria:delete'>;

// ======================================================================

export type IAuthzPolicyStatementFeriadoRead =
  IAuthzPolicyStatementKindCheck<'feriado:read'>;

// ======================================================================

export type IAuthzPolicyStatementAgendamentoCreate =
  IAuthzPolicyStatementKindCheck<'agendamento:create', CreateAgendamentoDto>;

export type IAuthzPolicyStatementAgendamentoRead =
  IAuthzPolicyStatementKindFilter<'agendamento:read'>;

export type IAuthzPolicyStatementAgendamentoUpdate =
  IAuthzPolicyStatementKindFilter<'agendamento:update', UpdateAgendamentoDto>;

export type IAuthzPolicyStatementAgendamentoDelete =
  IAuthzPolicyStatementKindFilter<'agendamento:delete'>;

// ======================================================================

export type IAuthzPolicyStatementEscolaCreate = IAuthzPolicyStatementKindCheck<
  'escola:create',
  CreateEscolaDto
>;

export type IAuthzPolicyStatementEscolaRead =
  IAuthzPolicyStatementKindFilter<'escola:read'>;

export type IAuthzPolicyStatementEscolaUpdate = IAuthzPolicyStatementKindFilter<
  'escola:update',
  UpdateEscolaDto
>;

export type IAuthzPolicyStatementEscolaDelete =
  IAuthzPolicyStatementKindFilter<'escola:delete'>;

// ======================================================================

export type IAuthzPolicyStatementSecretariaCriteriosRead =
  IAuthzPolicyStatementKindFilter<'secretaria:criterios:read'>;

export type IAuthzPolicyStatementSecretariaCriteriosChange =
  IAuthzPolicyStatementKindFilter<
    'secretaria:criterios:change',
    ConfigurarCriteriosDto
  >;

// ======================================================================

export type IAuthzPolicyStatementSecretariaGerenciaAgendamentoRead =
  IAuthzPolicyStatementKindFilter<'secretaria:gerencia_agendamento:read'>;

export type IAuthzPolicyStatementSecretariaGerenciaAgendamentoChange =
  IAuthzPolicyStatementKindFilter<'secretaria:gerencia_agendamento:update'>;

// ======================================================================

export type IAuthzPolicyStatementTurmaCreate = IAuthzPolicyStatementKindCheck<
  'turma:create',
  CreateTurmaDto
>;

export type IAuthzPolicyStatementTurmaRead =
  IAuthzPolicyStatementKindFilter<'turma:read'>;

export type IAuthzPolicyStatementTurmaUpdate = IAuthzPolicyStatementKindFilter<
  'turma:update',
  UpdateTurmaDto
>;

export type IAuthzPolicyStatementTurmaDelete =
  IAuthzPolicyStatementKindFilter<'turma:delete'>;

// ======================================================================

export type IAuthzPolicyStatementCriterioCreate =
  IAuthzPolicyStatementKindCheck<'criterio:create', CreateCriteriosDto>;

export type IAuthzPolicyStatementCriterioRead =
  IAuthzPolicyStatementKindFilter<'criterio:read'>;

export type IAuthzPolicyStatementCriterioUpdate =
  IAuthzPolicyStatementKindFilter<'criterio:update', UpdateCriteriosDto>;

export type IAuthzPolicyStatementCriterioDelete =
  IAuthzPolicyStatementKindFilter<'criterio:delete'>;

// ======================================================================

export type IAuthzPolicyStatementRegistroVagaCreate =
  IAuthzPolicyStatementKindCheck<
    'registro_vaga:create',
    CreateRegistroVagasDto
  >;

export type IAuthzPolicyStatementVagaCreate = IAuthzPolicyStatementKindCheck<
  'vaga:create',
  CreateVagasDto
>;

export type IAuthzPolicyStatementRegistroVagaRead =
  IAuthzPolicyStatementKindFilter<'registro_vaga:read'>;

export type IAuthzPolicyStatementVagaRead =
  IAuthzPolicyStatementKindFilter<'vaga:read'>;

export type IAuthzPolicyStatementVagaUpdate = IAuthzPolicyStatementKindFilter<
  'vaga:update',
  UpdateVagasDto
>;

export type IAuthzPolicyStatementVagaDelete =
  IAuthzPolicyStatementKindFilter<'vaga:delete'>;

// ======================================================================

export type IAuthzPolicyStatementReservaVagaCreate =
  IAuthzPolicyStatementKindCheck<'reserva_vaga:create', CreateReservaVagaDto>;

export type IAuthzPolicyStatementReservaVagaRead =
  IAuthzPolicyStatementKindFilter<'reserva_vaga:read'>;

export type IAuthzPolicyStatementReservaVagaUpdate =
  IAuthzPolicyStatementKindFilter<'reserva_vaga:update', UpdateReservaVagaDto>;

export type IAuthzPolicyStatementReservaVagaUpdateStatus =
  IAuthzPolicyStatementKindFilter<
    'reserva_vaga:update:status',
    UpdateReservaVagaStatusDto
  >;

export type IAuthzPolicyStatementReservaVagaDelete =
  IAuthzPolicyStatementKindFilter<'reserva_vaga:delete'>;

// ======================================================================

export type IAuthzPolicyStatementServidorCreate =
  IAuthzPolicyStatementKindCheck<'servidor:create', CreateFuncionarioDto>;

export type IAuthzPolicyStatementServidorRead =
  IAuthzPolicyStatementKindFilter<'servidor:read'>;

export type IAuthzPolicyStatementServidorUpdate =
  IAuthzPolicyStatementKindFilter<'servidor:update', UpdateFuncionarioDto>;

export type IAuthzPolicyStatementServidorDelete =
  IAuthzPolicyStatementKindFilter<'servidor:delete'>;

// ======================================================================

export type IAuthzPolicyStatementCriancaCreate = IAuthzPolicyStatementKindCheck<
  'crianca:create',
  CreateCriancaDto
>;

export type IAuthzPolicyStatementCriancaRead =
  IAuthzPolicyStatementKindFilter<'crianca:read'>;

export type IAuthzPolicyStatementCriancaUpdate =
  IAuthzPolicyStatementKindFilter<'crianca:update', UpdateCriancaDto>;

export type IAuthzPolicyStatementCriancaDelete =
  IAuthzPolicyStatementKindFilter<'crianca:delete'>;

// ======================================================================

export type IAuthzPolicyStatementEntrevistaCreate =
  IAuthzPolicyStatementKindCheck<'entrevista:create', CreateEntrevistaDto>;

export type IAuthzPolicyStatementEntrevistaRead =
  IAuthzPolicyStatementKindFilter<'entrevista:read'>;

export type IAuthzPolicyStatementEntrevistaUpdate =
  IAuthzPolicyStatementKindFilter<'entrevista:update', UpdateEntrevistaDto>;

export type IAuthzPolicyStatementEntrevistaDelete =
  IAuthzPolicyStatementKindFilter<'entrevista:delete'>;

// ======================================================================

export type IAuthzPolicyStatementRegistroContatoCreate =
  IAuthzPolicyStatementKindCheck<
    'registro_contato:create',
    CreateRegistrarContatoDto
  >;

export type IAuthzPolicyStatementRegistroContatoRead =
  IAuthzPolicyStatementKindFilter<'registro_contato:read'>;

export type IAuthzPolicyStatementRegistroContatoUpdate =
  IAuthzPolicyStatementKindFilter<
    'registro_contato:update',
    UpdateRegistrarContatoDto
  >;

export type IAuthzPolicyStatementRegistroContatoDelete =
  IAuthzPolicyStatementKindFilter<'registro_contato:delete'>;

// ======================================================================

export type IAuthzPolicyStatementFilaRead =
  IAuthzPolicyStatementKindFilter<'fila:read'>;

export type IAuthzPolicyStatementBaseArquivoRead =
  IAuthzPolicyStatementKindCheck<'arquivo:read', ArquivoDto>;

// ======================================================================

export type IAuthzPolicyStatementEtapaRead =
  IAuthzPolicyStatementKindFilter<'etapa:read'>;

// ======================================================================

export type IAuthzPolicyStatementReport = IAuthzPolicyStatementKindCheck<
  'report:check',
  ReportDto
>;

// ======================================================================

export type IAuthzPolicyStatementEndereco = IAuthzPolicyStatementKindCheck<
  'endereco:check',
  CreateEnderecoDto
>;

// ==============================================================================

export type IAuthzPolicyStatementUiViewIntegrations =
  IAuthzPolicyStatementKindCheck<'ui:view:feature:integrations'>;

// ==============================================================================

export type IAuthzPolicyStatementUiViewAgendamento =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:agendamento'>;

export type IAuthzPolicyStatementUiViewAgendamentoCalendario =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:agendamento:calendario'>;

export type IAuthzPolicyStatementUiViewAgendamentoGerenciar =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:agendamento:gerenciar'>;

export type IAuthzPolicyStatementUiViewAgendamentoConsultar =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:agendamento:consultar'>;

// ======================================================================

export type IAuthzPolicyStatementUiViewEntrevista =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:entrevista'>;

export type IAuthzPolicyStatementUiViewEntrevistaEntrevistar =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:entrevista:entrevistar'>;

export type IAuthzPolicyStatementUiViewEntrevistaConsultar =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:entrevista:consultar'>;

// ======================================================================

export type IAuthzPolicyStatementUiViewCriterios =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:criterios'>;

export type IAuthzPolicyStatementUiViewCriteriosGerenciar =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:criterios:gerenciar'>;

export type IAuthzPolicyStatementUiViewCriteriosConsultar =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:criterios:consultar'>;

// ======================================================================

export type IAuthzPolicyStatementUiViewCadastro =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:cadastro'>;

export type IAuthzPolicyStatementUiViewCadastroSecretaria =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:cadastro:secretaria'>;

export type IAuthzPolicyStatementUiViewCadastroEscola =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:cadastro:escola'>;

export type IAuthzPolicyStatementUiViewCadastroTurma =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:cadastro:turma'>;

export type IAuthzPolicyStatementUiViewCadastroVaga =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:cadastro:vaga'>;

export type IAuthzPolicyStatementUiViewCadastroCrianca =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:cadastro:crianca'>;

export type IAuthzPolicyStatementUiViewCadastroServidor =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:cadastro:servidor'>;

// ================================

export type IAuthzPolicyStatementUiViewConsulta =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:consulta'>;

export type IAuthzPolicyStatementUiViewConsultaSecretaria =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:consulta:secretaria'>;

export type IAuthzPolicyStatementUiViewConsultaEscola =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:consulta:escola'>;

export type IAuthzPolicyStatementUiViewConsultaTurma =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:consulta:turma'>;

export type IAuthzPolicyStatementUiViewConsultaVaga =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:consulta:vaga'>;

export type IAuthzPolicyStatementUiViewConsultaReservaVaga =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:consulta:reserva_vaga'>;

export type IAuthzPolicyStatementUiViewConsultaCrianca =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:consulta:crianca'>;

export type IAuthzPolicyStatementUiViewConsultaServidor =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:consulta:servidor'>;

// ================================

export type IAuthzPolicyStatementUiViewFilaItemFazerContato =
  IAuthzPolicyStatementKindCheck<'ui:view:fila:item:fazer_contato'>;

export type IAuthzPolicyStatementUiViewFilaItemReservarVaga =
  IAuthzPolicyStatementKindCheck<'ui:view:fila:item:reservar_vaga'>;

// ==============================================================================

export type IAuthzPolicyStatementFilter =
  | IAuthzPolicyStatementIntegrationAccessTokenRead
  | IAuthzPolicyStatementIntegrationAccessTokenUpdate
  | IAuthzPolicyStatementIntegrationAccessTokenDelete
  //
  | IAuthzPolicyStatementSecretariaRead
  | IAuthzPolicyStatementSecretariaUpdate
  | IAuthzPolicyStatementSecretariaDelete
  //
  | IAuthzPolicyStatementEscolaRead
  | IAuthzPolicyStatementEscolaUpdate
  | IAuthzPolicyStatementEscolaDelete
  //
  | IAuthzPolicyStatementSecretariaCriteriosRead
  | IAuthzPolicyStatementSecretariaCriteriosChange
  //
  | IAuthzPolicyStatementSecretariaGerenciaAgendamentoRead
  | IAuthzPolicyStatementSecretariaGerenciaAgendamentoChange
  //
  | IAuthzPolicyStatementServidorRead
  | IAuthzPolicyStatementServidorUpdate
  | IAuthzPolicyStatementServidorDelete
  //
  | IAuthzPolicyStatementTurmaRead
  | IAuthzPolicyStatementTurmaUpdate
  | IAuthzPolicyStatementTurmaDelete
  //
  | IAuthzPolicyStatementCriterioRead
  | IAuthzPolicyStatementCriterioUpdate
  | IAuthzPolicyStatementCriterioDelete
  //
  | IAuthzPolicyStatementRegistroVagaRead
  | IAuthzPolicyStatementVagaRead
  | IAuthzPolicyStatementVagaUpdate
  | IAuthzPolicyStatementVagaDelete
  //
  | IAuthzPolicyStatementReservaVagaRead
  | IAuthzPolicyStatementReservaVagaUpdate
  | IAuthzPolicyStatementReservaVagaUpdateStatus
  | IAuthzPolicyStatementReservaVagaDelete
  //
  | IAuthzPolicyStatementCriancaRead
  | IAuthzPolicyStatementCriancaUpdate
  | IAuthzPolicyStatementCriancaDelete
  //
  | IAuthzPolicyStatementEntrevistaRead
  | IAuthzPolicyStatementEntrevistaUpdate
  | IAuthzPolicyStatementEntrevistaDelete
  //
  | IAuthzPolicyStatementAgendamentoRead
  | IAuthzPolicyStatementAgendamentoUpdate
  | IAuthzPolicyStatementAgendamentoDelete
  //
  | IAuthzPolicyStatementRegistroContatoRead
  | IAuthzPolicyStatementRegistroContatoUpdate
  | IAuthzPolicyStatementRegistroContatoDelete
  //
  | IAuthzPolicyStatementFilaRead
  //
  | IAuthzPolicyStatementEtapaRead;

export type IAuthzPolicyStatementCheck =
  | IAuthzPolicyStatementFeriadoRead
  //
  | IAuthzPolicyStatementReport
  //
  | IAuthzPolicyStatementIntegrationAccessTokenCreate
  //
  | IAuthzPolicyStatementSecretariaCreate
  //
  | IAuthzPolicyStatementEscolaCreate
  //
  | IAuthzPolicyStatementAgendamentoCreate
  //
  | IAuthzPolicyStatementBaseArquivoRead
  //
  | IAuthzPolicyStatementServidorCreate
  //
  | IAuthzPolicyStatementTurmaCreate
  //
  | IAuthzPolicyStatementCriterioCreate
  //
  | IAuthzPolicyStatementRegistroVagaCreate
  //
  | IAuthzPolicyStatementVagaCreate
  //
  | IAuthzPolicyStatementReservaVagaCreate
  //
  | IAuthzPolicyStatementCriancaCreate
  //
  | IAuthzPolicyStatementEntrevistaCreate
  //
  | IAuthzPolicyStatementRegistroContatoCreate
  //
  | IAuthzPolicyStatementUiViewIntegrations
  //
  | IAuthzPolicyStatementUiViewAgendamento
  | IAuthzPolicyStatementUiViewAgendamentoCalendario
  | IAuthzPolicyStatementUiViewAgendamentoGerenciar
  //
  | IAuthzPolicyStatementUiViewEntrevista
  | IAuthzPolicyStatementUiViewEntrevistaEntrevistar
  | IAuthzPolicyStatementUiViewEntrevistaConsultar
  //
  | IAuthzPolicyStatementUiViewAgendamentoConsultar
  //
  | IAuthzPolicyStatementUiViewCriterios
  | IAuthzPolicyStatementUiViewCriteriosGerenciar
  | IAuthzPolicyStatementUiViewCriteriosConsultar
  //
  | IAuthzPolicyStatementUiViewCadastro
  | IAuthzPolicyStatementUiViewCadastroSecretaria
  | IAuthzPolicyStatementUiViewCadastroEscola
  | IAuthzPolicyStatementUiViewCadastroTurma
  | IAuthzPolicyStatementUiViewCadastroVaga
  | IAuthzPolicyStatementUiViewCadastroCrianca
  | IAuthzPolicyStatementUiViewCadastroServidor
  //
  | IAuthzPolicyStatementUiViewConsulta
  | IAuthzPolicyStatementUiViewConsultaSecretaria
  | IAuthzPolicyStatementUiViewConsultaEscola
  | IAuthzPolicyStatementUiViewConsultaTurma
  | IAuthzPolicyStatementUiViewConsultaVaga
  | IAuthzPolicyStatementUiViewConsultaReservaVaga
  | IAuthzPolicyStatementUiViewConsultaCrianca
  | IAuthzPolicyStatementUiViewConsultaServidor
  | IAuthzPolicyStatementUiViewFilaItemFazerContato
  | IAuthzPolicyStatementUiViewFilaItemReservarVaga;

// ==============================================================================

export type IAuthzPolicyStatement =
  | IAuthzPolicyStatementFilter
  | IAuthzPolicyStatementCheck;
