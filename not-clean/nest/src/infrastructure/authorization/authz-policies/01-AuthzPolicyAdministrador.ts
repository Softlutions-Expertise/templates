import { Injectable } from '@nestjs/common';
import { BaseAuthzPolicy } from './BaseAuthzPolicy';

@Injectable()
export class AuthzPolicyAdministrador extends BaseAuthzPolicy {
  name = 'authz-policy::administrador';

  constructor() {
    super();

    this.setStatements(
      {
        feriadoRead: true,
        //
        integrationAccessTokenCreate: true,
        integrationAccessTokenRead: true,
        integrationAccessTokenUpdate: true,
        integrationAccessTokenDelete: true,
        //
        secretariaCreate: true,
        secretariaRead: true,
        secretariaUpdate: true,
        secretariaDelete: true,
        //
        escolaCreate: true,
        escolaRead: true,
        escolaUpdate: true,
        escolaDelete: true,
        //
        agendamentoCreate: true,
        agendamentoRead: true,
        agendamentoUpdate: true,
        agendamentoDelete: true,
        //
        secretariaCriteriosRead: true,
        secretariaCriteriosChange: true,
        //
        secretariaGerenciaAgendamentoRead: true,
        secretariaGerenciaAgendamentoUpdate: true,
        //
        servidorCreate: true,
        servidorRead: true,
        servidorUpdate: true,
        servidorDelete: true,
        //
        turmaCreate: true,
        turmaRead: true,
        turmaUpdate: true,
        turmaDelete: true,
        //
        criterioCreate: true,
        criterioRead: true,
        criterioUpdate: true,
        criterioDelete: true,
        //
        registroVagaCreate: true,
        registroVagaRead: true,
        //
        vagaCreate: true,
        vagaRead: true,
        vagaUpdate: true,
        vagaDelete: true,
        //
        criancaCreate: true,
        criancaRead: true,
        criancaUpdate: true,
        criancaDelete: true,
        //
        entrevistaCreate: true,
        entrevistaRead: true,
        entrevistaUpdate: true,
        entrevistaDelete: true,
        //
        registroContatoCreate: true,
        registroContatoRead: true,
        registroContatoUpdate: true,
        registroContatoDelete: true,
        //
        reservaVagaCreate: true,
        reservaVagaRead: true,
        reservaVagaUpdate: true,
        reservaVagaUpdateStatus: true,
        reservaVagaDelete: true,
        //
        arquivoRead: true,
        //
        filaRead: true,
        //
        etapaRead: true,
        //
        reportContext: true,
        //
        enderecoContext: true,
      },
      {
        agendamento: {
          calendario: true,
          gerenciar: true,
          consultar: true,
        },

        entrevista: {
          entrevistar: true,
          consultar: true,
        },

        criterios: {
          gerenciar: true,
          consultar: true,
        },

        consulta: {
          secretaria: true,
          escola: true,
          turma: true,
          vaga: true,
          reservaVaga: true,
          crianca: true,
          servidor: true,
        },

        cadastro: {
          secretaria: true,
          escola: true,
          turma: true,
          vaga: true,
          crianca: true,
          servidor: true,
        },

        reservaVaga: {
          updateStatus: true,
        },

        fila: {
          itemReservarVaga: true,
          itemFazerContato: true,
        },

        report: true,

        features: {
          integrations: true,
        },
      },
    );
  }
}
