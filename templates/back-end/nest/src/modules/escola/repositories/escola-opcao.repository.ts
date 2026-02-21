import {
  Categoria,
  Conveniada,
  Dependencia,
  Esfera,
  Mantedora,
  Orgao,
  Regulamentacao,
  SituacaoFuncionamento,
  Tipo,
  Unidade,
} from '../entities/enums/escola.enum';

import { Injectable } from '@nestjs/common';

@Injectable()
export class EscolaOpcaoRepository {
  findAll() {
    return {
      escola: {
        situacao: Object.values(SituacaoFuncionamento),
        dependencia: Object.values(Dependencia),
        orgao: Object.values(Orgao),
        categoria: Object.values(Categoria),
        conveniada: Object.values(Conveniada),
        mantedora: Object.values(Mantedora),
        segulamentacao: Object.values(Regulamentacao),
        esfera: Object.values(Esfera),
        unidade: Object.values(Unidade),
        tipo: Object.values(Tipo),
      },
    };
  }
}
