import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import eventBus from '../../helpers/eventEmitter.helper';
import { EtapaEntity } from '../../modules/etapa/etapa.entity';
import { SecretariaMunicipalEtapaEntity } from '../../modules/secretaria-municipal-etapa/secretaria-municipal-etapa.entity';

export class AlterEtapaInEntrevista1727144500798 implements MigrationInterface {
  private repositorySecEtapas: Repository<SecretariaMunicipalEtapaEntity>;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE entrevista ALTER COLUMN preferencia_turno DROP NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE entrevista ALTER COLUMN preferencia_unidade DROP NOT NULL`,
    );

    this.repositorySecEtapas = queryRunner.manager.getRepository(
      SecretariaMunicipalEtapaEntity,
    );

    const entrevistasRaw = await queryRunner.query(`
      SELECT 
        e.id, 
        e.preferencia_turno, 
        e.preferencia_unidade, 
        e.preferencia_turno2, 
        e.preferencia_unidade2,
        e.secretaria_municipal_id,
        c.data_nascimento
      FROM entrevista e
      JOIN crianca c ON e.crianca_id = c.id
    `);

    for (const entrevistaRaw of entrevistasRaw) {
      const secretariaMunicipal = await queryRunner.manager.findOne(
        'secretaria_municipal',
        { where: { id: entrevistaRaw.secretaria_municipal_id } },
      );

      const criancaDataNascimento = new Date(entrevistaRaw.data_nascimento);

      const etapa =
        await this.findEtapaBySecretariaMunicipalIDAndDataNascimento(
          secretariaMunicipal.id,
          criancaDataNascimento,
        );

      if (!etapa || etapa === null) {
        await queryRunner.query(`
          UPDATE entrevista 
          SET etapa_id = NULL 
          WHERE id = '${entrevistaRaw.id}'
        `);
        continue;
      }

      let escola1Id = entrevistaRaw.preferencia_unidade;
      let turno1 = entrevistaRaw.preferencia_turno;

      let escola2Id = entrevistaRaw.preferencia_unidade_2;
      let turno2 = entrevistaRaw.preferencia_turno_2;

      let turma1Exists = await queryRunner.query(
        `SELECT COUNT(*) > 0 AS exists FROM turma WHERE etapa_id = '${etapa.id}' AND escola_id = '${escola1Id}' AND turno = '${turno1}'`,
      );
      let turma1 = turma1Exists[0].exists;

      let turma2 = false;
      if (escola2Id && turno2) {
        let turma2Exists = await queryRunner.query(
          `SELECT COUNT(*) > 0 AS exists FROM turma WHERE etapa_id = '${etapa.id}' AND escola_id = '${escola2Id}' AND turno = '${turno2}'`,
        );
        turma2 = turma2Exists[0].exists;
      }

      let newEtapaId = null;
      if (turma1 || (escola2Id && turno2 && turma2)) {
        newEtapaId = etapa.id;
      }

      await queryRunner.query(`
        UPDATE entrevista 
        SET etapa_id = ${newEtapaId ? `'${newEtapaId}'` : 'NULL'} 
        WHERE id = '${entrevistaRaw.id}'
      `);

      if (newEtapaId) {
        const entrevista = {
          id: entrevistaRaw.id,
          etapa: etapa,
        };
        eventBus.emit('criarFila', entrevista);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE entrevista ALTER COLUMN preferencia_turno SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE entrevista ALTER COLUMN preferencia_unidade SET NOT NULL`,
    );
  }

  async findEtapaBySecretariaMunicipalIDAndDataNascimento(
    secretariaMunicipalId: string,
    dataNascimento: Date,
  ): Promise<EtapaEntity> {
    const birthdate = new Date(dataNascimento);
    const currentYear = new Date().getFullYear();

    const secretariaMunicipalEtapas =
      await this.findBySecretariaMunicipalIdAndAtiva(secretariaMunicipalId);

    const matchingsecretariaMunicipalEtapas = secretariaMunicipalEtapas.filter(
      (secretariaMunicipalEtapa) => {
        const [month, day] =
          secretariaMunicipalEtapa.secretariaMunicipal.dataLimite
            .split('-')
            .map(Number);
        const currentDate = new Date(currentYear, month - 1, day);
        const ageInYears = this.calculateAgeInYears(birthdate, currentDate);

        if (
          secretariaMunicipalEtapa.idadeInicial === 0 &&
          ageInYears <= secretariaMunicipalEtapa.idadeFinal
        ) {
          return true;
        }

        return (
          ageInYears >= secretariaMunicipalEtapa.idadeInicial &&
          ageInYears <= secretariaMunicipalEtapa.idadeFinal
        );
      },
    );

    if (matchingsecretariaMunicipalEtapas.length === 0) {
      return null;
    }

    return matchingsecretariaMunicipalEtapas[0].etapa;
  }

  async findBySecretariaMunicipalIdAndAtiva(
    secretariaMunicipalId: string,
  ): Promise<SecretariaMunicipalEtapaEntity[]> {
    const secretariaMunicipalEtapas = await this.repositorySecEtapas.find({
      where: {
        secretariaMunicipal: { id: secretariaMunicipalId },
        ativa: true,
      },
      relations: ['etapa', 'secretariaMunicipal'],
    });

    return secretariaMunicipalEtapas;
  }

  private calculateAgeInYears(birthdate: Date, referenceDate: Date): number {
    const birthYear = birthdate.getFullYear();
    const birthMonth = birthdate.getMonth();
    const birthDay = birthdate.getDate();

    const refYear = referenceDate.getFullYear();
    const refMonth = referenceDate.getMonth();
    const refDay = referenceDate.getDate();

    let yearDifference = refYear - birthYear;
    let monthDifference = refMonth - birthMonth;
    let dayDifference = refDay - birthDay;

    if (monthDifference < 0) {
      yearDifference -= 1;
      monthDifference += 12;
    }

    if (dayDifference < 0) {
      monthDifference -= 1;
    }

    const formattedMonths =
      monthDifference < 10 ? `0${monthDifference}` : `${monthDifference}`;

    const ageInYearsAndMonths = parseFloat(
      `${yearDifference}.${formattedMonths}`,
    );

    return ageInYearsAndMonths;
  }
}
