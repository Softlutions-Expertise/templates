import { ArquivoDto } from '../../../../helpers/dtos/arquivo.dto';
import { CreateEnderecoDto } from '../../../../modules/base/dto/create-endereco.dto';
import { CreateIntegrationAccessTokenDto } from '../../../../modules/integrations/integration-access-token/dto/create-integration-access-token.dto';
import { UpdateIntegrationAccessTokenDto } from '../../../../modules/integrations/integration-access-token/dto/update-integration-access-token.dto';
import { CreateColaboradorDto } from '../../../../modules/pessoa/dto/create-colaborador.dto';
import { UpdateColaboradorDto } from '../../../../modules/pessoa/dto/update-colaborador.dto';
import { ReportDto } from '../../../../modules/report/dtos/report.dto';
import {
  IAuthzPolicyStatementKindCheck,
  IAuthzPolicyStatementKindFilter,
} from './IAuthzBaseStatement';

// ==============================================================================
// Integration Access Token
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

// ==============================================================================
// Colaborador
// ==============================================================================

export type IAuthzPolicyStatementColaboradorCreate =
  IAuthzPolicyStatementKindCheck<'colaborador:create', CreateColaboradorDto>;

export type IAuthzPolicyStatementColaboradorRead =
  IAuthzPolicyStatementKindFilter<'colaborador:read'>;

export type IAuthzPolicyStatementColaboradorUpdate =
  IAuthzPolicyStatementKindFilter<'colaborador:update', UpdateColaboradorDto>;

export type IAuthzPolicyStatementColaboradorDelete =
  IAuthzPolicyStatementKindFilter<'colaborador:delete'>;

// ==============================================================================
// Pessoa
// ==============================================================================

export type IAuthzPolicyStatementPessoaRead =
  IAuthzPolicyStatementKindFilter<'pessoa:read'>;

// ==============================================================================
// Arquivo
// ==============================================================================

export type IAuthzPolicyStatementBaseArquivoRead =
  IAuthzPolicyStatementKindCheck<'arquivo:read', ArquivoDto>;

// ==============================================================================
// Relatório
// ==============================================================================

export type IAuthzPolicyStatementReportGenerate =
  IAuthzPolicyStatementKindCheck<'report:generate', ReportDto>;

// ==============================================================================
// Endereço
// ==============================================================================

export type IAuthzPolicyStatementEndereco =
  IAuthzPolicyStatementKindCheck<'endereco:check', CreateEnderecoDto>;

// ==============================================================================
// UI - Features
// ==============================================================================

export type IAuthzPolicyStatementUiViewIntegrations =
  IAuthzPolicyStatementKindCheck<'ui:view:feature:integrations'>;

// ==============================================================================
// UI - Colaborador
// ==============================================================================

export type IAuthzPolicyStatementUiViewColaborador =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:colaborador'>;

export type IAuthzPolicyStatementUiViewColaboradorCadastrar =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:colaborador:cadastrar'>;

export type IAuthzPolicyStatementUiViewColaboradorConsultar =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:colaborador:consultar'>;

// ==============================================================================
// UI - Pessoa
// ==============================================================================

export type IAuthzPolicyStatementUiViewPessoa =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:pessoa'>;

export type IAuthzPolicyStatementUiViewPessoaConsultar =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:pessoa:consultar'>;

// ==============================================================================
// UI - Relatório
// ==============================================================================

export type IAuthzPolicyStatementUiViewReport =
  IAuthzPolicyStatementKindCheck<'ui:view:menu:report'>;

// ==============================================================================
// Union Types
// ==============================================================================

export type IAuthzPolicyStatementFilter =
  | IAuthzPolicyStatementIntegrationAccessTokenRead
  | IAuthzPolicyStatementIntegrationAccessTokenUpdate
  | IAuthzPolicyStatementIntegrationAccessTokenDelete
  | IAuthzPolicyStatementColaboradorRead
  | IAuthzPolicyStatementColaboradorUpdate
  | IAuthzPolicyStatementColaboradorDelete
  | IAuthzPolicyStatementPessoaRead;

export type IAuthzPolicyStatementCheck =
  | IAuthzPolicyStatementIntegrationAccessTokenCreate
  | IAuthzPolicyStatementColaboradorCreate
  | IAuthzPolicyStatementBaseArquivoRead
  | IAuthzPolicyStatementReportGenerate
  | IAuthzPolicyStatementEndereco
  | IAuthzPolicyStatementUiViewIntegrations
  | IAuthzPolicyStatementUiViewColaborador
  | IAuthzPolicyStatementUiViewColaboradorCadastrar
  | IAuthzPolicyStatementUiViewColaboradorConsultar
  | IAuthzPolicyStatementUiViewPessoa
  | IAuthzPolicyStatementUiViewPessoaConsultar
  | IAuthzPolicyStatementUiViewReport;

// ==============================================================================

export type IAuthzPolicyStatement =
  | IAuthzPolicyStatementFilter
  | IAuthzPolicyStatementCheck;
