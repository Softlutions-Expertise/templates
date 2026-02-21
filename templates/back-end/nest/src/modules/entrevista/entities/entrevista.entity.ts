import { IsBoolean } from 'class-validator';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EscolaEntity } from '../../escola/entities/escola.entity';
import { EtapaEntity } from '../../etapa/etapa.entity';
import { FilaGeradaPosicaoEntity } from '../../fila/entities/fila-gerada-posicao.entity';
import { CriancaEntity } from '../../pessoa/entities/crianca.entity';
import { FuncionarioEntity } from '../../pessoa/entities/funcionario.entity';
import { ReservaVagaEntity } from '../../reserva-vaga/entities/reserva-vaga.entity';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';
import { EntrevistaStatusEnum } from '../dto/enums/entrevista-status-enum';
import { Criterios } from '../dto/enums/enum';
import { EntrevistaMatchCriterioEntity } from './etrevista_match_criterio.entity';
import { RegistrarContatoEntity } from './registrar-contato.entity';

@Entity('entrevista')
export class EntrevistaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  dataEntrevista!: Date;

  @Column({ type: 'varchar', name: 'horario_agendamento' })
  horarioEntrevista!: string;

  @Column({ type: 'varchar' })
  preferenciaTurno!: string;

  @Column({ type: 'varchar' })
  preferenciaTurno2!: string;

  @Column({ type: 'bool' })
  @IsBoolean()
  elegivelParaFila!: boolean;

  @Column({ type: 'bool' })
  @IsBoolean()
  elegivelParaFila2!: boolean;

  @Column({ type: 'bool' })
  @IsBoolean()
  possuiIrmaoNaUnidade!: boolean;

  @Column({ type: 'varchar' })
  nomeIrmao!: string;

  @Column({ type: 'varchar' })
  cpfIrmao!: string;

  @Column({ type: 'varchar' })
  tipoResponsavel!: string;

  @Column({ type: 'varchar' })
  nomeResponsavel!: string;

  @Column({ type: 'varchar' })
  cpfResponsavel!: string;

  @CreateDateColumn()
  dataNascimentoResponsavel!: Date;

  @Column({ type: 'varchar' })
  sexoResponsavel!: string;

  @Column({ type: 'varchar' })
  estadoCivilResponsavel!: string;

  @Column({ type: 'text', nullable: true })
  parentescoResponsavel!: string | null;

  @Column({ type: 'integer' })
  membrosEderecoCrianca: number;

  @Column({ type: 'integer' })
  membrosContribuintesRenda: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  valorRendaFamiliar: number;

  @Column({ type: 'varchar' })
  observacoesFamilia!: string;

  @Column({ type: 'varchar' })
  observacoesCentralVagas!: string;

  @Column()
  anoLetivo!: string;

  // Campo enum no banco de dados
  @Column({
    type: 'enum',
    enum: EntrevistaStatusEnum,
    default: EntrevistaStatusEnum.AGUARDANDO,
  })
  status!: EntrevistaStatusEnum;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  updatedAt!: Date;

  @OneToOne(() => CriancaEntity, (crianca) => crianca.entrevista, {
    eager: false,
  })
  @JoinColumn({ name: 'crianca_id', referencedColumnName: 'id' })
  crianca!: CriancaEntity;

  @ManyToOne(() => EscolaEntity, { eager: true })
  @JoinColumn({ name: 'preferencia_unidade', referencedColumnName: 'id' })
  preferenciaUnidade: EscolaEntity;

  @ManyToOne(() => EscolaEntity, { eager: true })
  @JoinColumn({ name: 'preferencia_unidade2', referencedColumnName: 'id' })
  preferenciaUnidade2: EscolaEntity;

  @ManyToOne(() => FuncionarioEntity, { eager: true })
  @JoinColumn({ name: 'entrevistador', referencedColumnName: 'id' })
  entrevistador!: FuncionarioEntity;

  @ManyToOne(() => SecretariaMunicipalEntity, { eager: true })
  @JoinColumn({ name: 'secretaria_municipal_id', referencedColumnName: 'id' })
  secretariaMunicipal!: SecretariaMunicipalEntity;

  @ManyToOne(() => EscolaEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'unidade_escolar_irmao_id', referencedColumnName: 'id' })
  unidadeEscolarIrmao!: EscolaEntity | null;

  @OneToMany(
    () => EntrevistaMatchCriterioEntity,
    (matchCriterio) => matchCriterio.entrevista,
    {
      cascade: ['remove'],
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  public matchCriterios!: EntrevistaMatchCriterioEntity[];

  @OneToMany(
    () => RegistrarContatoEntity,
    (registroContato) => registroContato.entrevista,
    {
      cascade: ['remove'],
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  registroContatos!: RegistrarContatoEntity[];

  @OneToOne(() => ReservaVagaEntity, (reservaVaga) => reservaVaga.entrevista, {
    eager: false,
  })
  reservaVaga?: ReservaVagaEntity | null;

  @ManyToOne(() => EtapaEntity, { eager: true })
  @JoinColumn({ name: 'etapa_id', referencedColumnName: 'id' })
  etapa: EtapaEntity;

  @OneToMany(() => FilaGeradaPosicaoEntity, (row) => row.entrevista, {
    eager: false,
  })
  filaGeradaPosicao!: FilaGeradaPosicaoEntity[];

  @OneToMany(
    () => RegistrarContatoEntity,
    (registrarContato) => registrarContato.entrevista,
  )
  registrarContato: RegistrarContatoEntity[];

  criterios!: Criterios[];
  escolaRazaoSocial: null;
  vagaEscolaId: null;

  @AfterLoad()
  loadCriterios() {
    EntrevistaEntity.attachCriteriosFromMatchCriterios(this);
  }

  static attachCriteriosFromMatchCriterios(entity: EntrevistaEntity) {
    try {
      if (entity) {
        const criterios =
          EntrevistaEntity.getCriteriosFromMatchCriterios(entity);

        entity.criterios = criterios;
      }
    } catch (e) {}

    return entity;
  }

  static getCriteriosFromMatchCriterios(entity: EntrevistaEntity): Criterios[] {
    if (entity.matchCriterios) {
      return entity.matchCriterios
        .filter((i) => i.versaoMaisRecente === true)
        .map(
          (matchCriterio): Criterios => ({
            id: matchCriterio.criterio.id,

            ativo: matchCriterio.ativo,

            arquivo: matchCriterio.arquivo?.accessToken,
            nomeArquivo: matchCriterio.arquivo?.nomeArquivo,
            tipoArquivo: matchCriterio.arquivo?.tipoArquivo,
            nameSizeFile: matchCriterio.arquivo?.nameSizeFile,
            byteString: matchCriterio.arquivo?.byteString,
          }),
        );
    }

    return [];
  }
}
