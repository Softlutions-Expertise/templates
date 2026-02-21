import { Injectable } from '@nestjs/common';
import { DatabaseContextService } from '../../../../../infrastructure/database-context/database-context.service';
import { FilaService } from '../../../../fila/fila.service';
import { getCountOrFallback } from '../utils/getCountOrFallback';

@Injectable()
export class PresentationCountersFilaDeEsperaEscolasTotalService {
  constructor(private databaseContextService: DatabaseContextService) {}

  private get escolaRepository() {
    return this.databaseContextService.escolaRepository;
  }

  async get(
    secretariasIds: string[] | null,
    _escolasIds: string[] | null,
    referenceYear: number,
  ) {
    const qb = this.escolaRepository.createQueryBuilder('escola');

    qb.distinct(true);

    qb.where(
      `
            EXISTS (
              SELECT 
                entrevista.id 
              FROM entrevista
              LEFT JOIN reserva_vaga ON reserva_vaga.entrevista_id = entrevista.id
              WHERE (
                (
                  entrevista.elegivel_para_fila = TRUE
                )
                AND
                (
                  entrevista.ano_letivo >= :anoAtual
                )
                AND
                (
                  reserva_vaga.id IS NULL
                )
                AND
                (
                  entrevista.preferencia_unidade = escola.id
                  OR 
                  entrevista.preferencia_unidade2 = escola.id
                )
              )
              LIMIT 1
            )
          `,
      {
        anoAtual: referenceYear,
      },
    );

    qb.andWhere(
      `
            EXISTS (
              SELECT
                turma.id
              FROM turma
              INNER JOIN escola ON escola.id = turma.escola_id
              WHERE (
                turma.situacao = TRUE
                AND turma.ano_letivo >= :anoAtual
              )
              LIMIT 1
            )
        `,
      {
        anoAtual: referenceYear,
      },
    );

    if (secretariasIds) {
      qb.innerJoin('escola.secretariaMunicipal', 'secretaria_municipal');
      qb.andWhere('secretaria_municipal.id IN (:...secretariasIds)', {
        secretariasIds,
      });
    }

    return getCountOrFallback(qb);
  }
}
