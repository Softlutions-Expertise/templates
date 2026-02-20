import { Injectable } from '@nestjs/common';
import { AcessoControl } from '../../../../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../../../../infrastructure/database-context/database-context.service';
import type { PresentationCounterAgendamentosResultDto } from '../../types';
import { getCountOrFallback } from '../utils/getCountOrFallback';
import { getEmptyIfNoRequiredRelation } from '../utils/getEmptyIfNoRequiredRelation';
import { format } from 'date-fns';


const dereferenceDate = (date: Date | string) => {
  let asString: string;

  if(typeof date === "string") {
    asString = date;
  } else {
    asString = format(date, 'yyyy-MM-dd');
  }

  return asString.slice(0, 10);
}

@Injectable()
export class PresentationCountersAgendamentosService {
  constructor(private databaseContextService: DatabaseContextService) {}

  get agendamentoRepository() {
    return this.databaseContextService.agendamentoRepository;
  }

  async get(
    acessoControl: AcessoControl,
    secretariasIds: string[] | null,
    locaisAtendimentosIds: string[] | null,
    referenceDate: Date | string,
  ): Promise<PresentationCounterAgendamentosResultDto> {
    if (getEmptyIfNoRequiredRelation(secretariasIds, null)) {
      return {
        hoje: '0',
        futuros: '0',
        passados: '0',
        cadastrados: '0',
      };
    }

    const qbBase = this.agendamentoRepository.createQueryBuilder('agendamento');

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'agendamento:read',
        qbBase,
      );
    }
    
    qbBase.leftJoinAndSelect(
      'agendamento.localAtendimento',
      'localAtendimento',
    );

    qbBase.leftJoinAndSelect(
      'localAtendimento.secretariaMunicipal',
      'localAtendimento_secretaria',
    );

    if (secretariasIds) {
      if (secretariasIds.length > 0) {
        qbBase.andWhere('localAtendimento_secretaria.id IN (:...secretariasIds)', {
          secretariasIds,
        });
      } else {
        qbBase.andWhere('FALSE');
      }
    }

    if (locaisAtendimentosIds) {
      if (locaisAtendimentosIds.length > 0) {
        qbBase.andWhere('localAtendimento.id IN (:...locaisAtendimentosIds)', {
          locaisAtendimentosIds,
        });
      } else {
        qbBase.andWhere('FALSE');
      }
    }

    const consideredDate = dereferenceDate(referenceDate);

    const totalQb = qbBase.clone();

    const hojeQb = qbBase.clone();
    hojeQb.andWhere('CAST(agendamento.data AS DATE) = CAST(:referenceDate AS DATE)', {
      referenceDate: consideredDate,
    });

    const futurosQb = qbBase.clone();
    futurosQb.andWhere('CAST(agendamento.data AS DATE) > CAST(:referenceDate AS DATE)', {
      referenceDate: consideredDate,
    });

    const passadosQb = qbBase.clone();
    passadosQb.andWhere('CAST(agendamento.data AS DATE) < CAST(:referenceDate AS DATE)', {
      referenceDate: consideredDate,
    });

    const hoje = await getCountOrFallback(hojeQb);
    const futuros = await getCountOrFallback(futurosQb);
    const passados = await getCountOrFallback(passadosQb);
    const cadastrados = await getCountOrFallback(totalQb);

    return {
      hoje,
      futuros,
      passados,
      cadastrados,
    };
  }
}
