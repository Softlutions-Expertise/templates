import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContatoEntity } from '../../base/entities/contato.entity';
import { EnderecoEntity } from '../../base/entities/endereco.entity';
import { DocumentoEntity } from '../../documento/documento.entity';
import { EtapaEntity } from '../../etapa/etapa.entity';
import { HorarioFuncionamentoEntity } from '../../horario-funcionamento/horario-funcionamento.entity';
import { SecretariaMunicipalEntity } from '../../secretaria-municipal/entities/secretaria-municipal.entity';
import {
  Categoria,
  Conveniada,
  Dependencia,
  Mantedora,
  Regulamentacao,
  SituacaoFuncionamento,
  Tipo,
} from './enums/escola.enum';
import { TurmaEntity } from './turma.entity';

@Entity('escola')
export class EscolaEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  foto!: string;

  @Column({ name: 'codigo_inep', unique: true })
  codigoInep!: string;

  @Column({ type: 'enum', enum: SituacaoFuncionamento })
  @IsEnum(SituacaoFuncionamento)
  situacaoFuncionamento!: SituacaoFuncionamento;

  @Column()
  autorizacaoFuncionamento!: string;

  @Column()
  latitude!: string;

  @Column()
  longitude!: string;

  @Column()
  razaoSocial!: string;

  @Column()
  nomeFantasia!: string;

  @Column()
  dataCriacao!: Date;

  @Column()
  denominacaoEscola!: string;

  @Column()
  codigoRegional!: number;

  @Column('enum', { enum: Tipo })
  tipoEscola: Tipo;

  @Column()
  nomeRegional!: string;

  @Column({ type: 'enum', enum: Dependencia })
  @IsEnum(Dependencia)
  dependenciaAdministrativa!: Dependencia;

  @Column({ type: 'enum', enum: Categoria })
  @IsEnum(Categoria)
  @IsOptional()
  categoriaEscolaPrivada!: Categoria;

  @Column('enum', { enum: Mantedora, array: true })
  @IsEnum(Mantedora, { each: true })
  @IsOptional()
  mantedoraEscolaPrivada!: Mantedora[];

  @Column()
  cnpjMantedoraEscolaPrivada!: string;

  @Column()
  cnpjEscola!: string;

  @Column({ default: 3 })
  prazoMatricula!: number;

  @Column('enum', { enum: Conveniada })
  conveniadaPoderPublico!: Conveniada;

  @Column({ type: 'enum', enum: Regulamentacao })
  @IsEnum(Regulamentacao)
  @IsOptional()
  regulamentacao!: Regulamentacao;

  @ManyToOne(() => EnderecoEntity, { eager: true })
  endereco!: EnderecoEntity;

  @OneToOne(() => ContatoEntity, { cascade: ['remove'] })
  @JoinColumn({ name: 'contato_id', referencedColumnName: 'id' })
  contato?: ContatoEntity;

  @ManyToOne(() => SecretariaMunicipalEntity, { eager: true })
  @JoinColumn({ name: 'secretaria_municipal_id', referencedColumnName: 'id' })
  secretariaMunicipal: SecretariaMunicipalEntity;

  @OneToMany(() => TurmaEntity, (turma) => turma.escola)
  turmas: TurmaEntity[];

  @OneToMany(() => DocumentoEntity, (documento) => documento.escola, {
    cascade: true,
  })
  documentos: DocumentoEntity[];

  @OneToMany(() => HorarioFuncionamentoEntity, (horario) => horario.escola, {
    cascade: true,
  })
  horariosFuncionamento: HorarioFuncionamentoEntity[];

  //Campo virtual apenas para pegar os turnos disponíveis na escola em questão
  @Expose()
  turnos?: string[];

  @AfterLoad()
  setTurnos() {
    if (!this.turnos && this.turmas) {
      this.turnos = [
        ...new Set(
          this.turmas
            .filter((turma) => turma.turno)
            .map((turma) => turma.turno),
        ),
      ];
    }
  }

  //Campo virtual apenas para pegar os turnos disponíveis na escola em questão
  @Expose()
  etapas?: EtapaEntity[];

  @AfterLoad()
  setEtapas() {
    if (!this.etapas && this.turmas) {
      const etapasMap = new Map<number, EtapaEntity>();

      this.turmas.forEach((turma) => {
        if (turma.etapa) {
          const etapaId = turma.etapa.id;
          if (!etapasMap.has(etapaId)) {
            turma.etapa.turnos = [];
            etapasMap.set(etapaId, turma.etapa);
          }
          if (
            turma.turno &&
            !etapasMap.get(etapaId).turnos.includes(turma.turno)
          ) {
            etapasMap.get(etapaId).turnos.push(turma.turno);
          }
        }
      });

      this.etapas = Array.from(etapasMap.values());
    }
  }
}
