import { Brackets, SelectQueryBuilder } from 'typeorm';
import {
  NivelAcesso,
  TipoVinculoInstituicao,
} from '../../../../modules/pessoa/entities/enums/pessoa.enum';

export function prepareServidorFilterRelatedSecretaria(
  secretariaIds: string[],
  excludeFuncionario: string | null = null,
) {
  return (qb: SelectQueryBuilder<any>) => {
    qb.leftJoin('funcionario.usuario', 'POL__usuario');

    qb.leftJoin(
      'funcionario.unidadesEscolares',
      'POL__escola',
      `funcionario.tipoVinculo = :tipoVinculoEscola`,
      {
        tipoVinculoEscola: TipoVinculoInstituicao.UnidadeEscolar,
      },
    );

    qb.leftJoin('POL__escola.secretariaMunicipal', 'POL__escola_secretaria');

    qb.leftJoin('funcionario.secretarias', 'POL__secretaria');

    if (excludeFuncionario) {
      qb.andWhere('funcionario.id <> :excludeFuncionario', {
        excludeFuncionario,
      });
    }

    qb.andWhere(
      new Brackets((qb) => {
        qb.where(
          new Brackets((qb) => {
            qb.where('POL__secretaria.id IN (:...secretariaIds)', {
              secretariaIds,
            }).andWhere('funcionario.tipoVinculo = :tipoVinculoSecretaria', {
              tipoVinculoSecretaria: TipoVinculoInstituicao.SecretariaMunicipal,
            });
          }),
        ).orWhere(
          new Brackets((qb) => {
            qb.where('POL__escola_secretaria.id IN (:...secretariaIds)', {
              secretariaIds,
            }).andWhere('funcionario.tipoVinculo = :tipoVinculoEscola', {
              tipoVinculoEscola: TipoVinculoInstituicao.UnidadeEscolar,
            });
          }),
        );
      }),
    );

    qb.andWhere(
      new Brackets((qb) => {
        qb.where(
          new Brackets((qb) => {
            qb.where('funcionario.tipoVinculo = :tipoVinculoSecretaria', {
              tipoVinculoSecretaria: TipoVinculoInstituicao.SecretariaMunicipal,
            }).andWhere(
              'POL__usuario.nivelAcesso IN (:...niveisAcessoSecretaria)',
              {
                niveisAcessoSecretaria: [
                  NivelAcesso.AdministradorMunicipal,
                  NivelAcesso.AtendenteSecretaria,
                ],
              },
            );
          }),
        ).orWhere(
          new Brackets((qb) => {
            qb.where('funcionario.tipoVinculo = :tipoVinculoEscola', {
              tipoVinculoEscola: TipoVinculoInstituicao.UnidadeEscolar,
            }).andWhere('POL__usuario.nivelAcesso = :nivelAcessoEscola', {
              nivelAcessoEscola: NivelAcesso.GestorCreche,
            });
          }),
        );
      }),
    );
  };
}

export function prepareServidorFilterRelatedUnidadeEscolar(
  escolasIds: string[],
  excludeFuncionario: string | null = null,
) {
  return (qb: SelectQueryBuilder<any>) => {
    qb.innerJoin('funcionario.unidadesEscolares', 'POL__escola');

    qb.andWhere('POL__escola.id IN (:...escolasIds)', {
      escolasIds,
    });

    if (excludeFuncionario) {
      qb.andWhere('funcionario.id <> :excludeFuncionario', {
        excludeFuncionario,
      });
    }
  };
}
