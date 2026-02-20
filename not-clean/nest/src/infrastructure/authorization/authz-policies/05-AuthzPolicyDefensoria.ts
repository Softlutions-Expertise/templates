import { Injectable } from '@nestjs/common';
import { NivelAcesso } from '../../../modules/pessoa/entities/enums/pessoa.enum';
import { BaseAuthzPolicy } from './BaseAuthzPolicy';

@Injectable()
export class AuthzPolicyDefensoria extends BaseAuthzPolicy {
  name = 'authz-policy::defensoria';

  //

  constructor() {
    super();

    this.setStatements(
      {
        feriadoRead: true,

        //
        agendamentoCreate: true,
        agendamentoRead: true,
        agendamentoUpdate: true,
        agendamentoDelete: true,
        //
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
        secretariaCriteriosRead: true,
        secretariaCriteriosChange: false,
        //
        secretariaGerenciaAgendamentoRead: true,
        secretariaGerenciaAgendamentoUpdate: false,
        //
        servidorCreate: false,
        servidorRead: true,

        servidorUpdate: async (context) => {
          const funcionario = context.currentFuncionario;
          const idFuncionario = funcionario.id;

          const dto = context.dto;

          const mesmoNivel =
            !dto?.nivelAcesso || dto?.nivelAcesso === NivelAcesso.Defensoria;

          if (mesmoNivel) {
            return (qb) => {
              qb.where('funcionario.id = :idFuncionario', { idFuncionario });
            };
          }

          return (qb) => {
            qb.where('FALSE');
          };
        },

        servidorDelete: false,
        //
        turmaCreate: false,
        turmaRead: true,
        turmaUpdate: false,
        turmaDelete: false,
        //
        registroVagaCreate: false,
        registroVagaRead: true,
        //
        vagaCreate: false,
        vagaRead: true,
        vagaUpdate: false,
        vagaDelete: false,
        //
        criterioCreate: false,
        criterioRead: true,
        criterioUpdate: false,
        criterioDelete: false,
        //
        criancaCreate: false,
        criancaRead: true,
        criancaUpdate: false,
        criancaDelete: false,
        //
        entrevistaCreate: false,
        entrevistaRead: true,
        entrevistaUpdate: false,
        entrevistaDelete: false,
        //
        registroContatoCreate: false,
        registroContatoRead: true,
        registroContatoUpdate: false,
        registroContatoDelete: false,
        //
        reservaVagaCreate: false,
        reservaVagaRead: true,
        reservaVagaUpdate: false,
        reservaVagaUpdateStatus: false,
        reservaVagaDelete: false,
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
          gerenciar: false,
          consultar: true,
        },

        entrevista: {
          entrevistar: false,
          consultar: true,
        },

        criterios: {
          gerenciar: false,
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
        cadastro: null,

        reservaVaga: {
          updateStatus: false,
        },

        fila: {
          itemReservarVaga: false,
          itemFazerContato: false,
        },

        report: true,
      },
    );
  }
}
