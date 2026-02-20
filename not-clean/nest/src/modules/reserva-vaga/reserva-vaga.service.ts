import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { type Address } from 'nodemailer/lib/mailer';
import { In, Not, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { paginateConfig } from '../../config/paginate.config';
import { TZ_OFFSET } from '../../config/TZ_OFFSET';
import eventBus from '../../helpers/eventEmitter.helper';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../infrastructure/database-context/database-context.service';
import { EntrevistaStatusEnum } from '../entrevista/dto/enums/entrevista-status-enum';
import { EntrevistaEntity } from '../entrevista/entities/entrevista.entity';
import { RegistrarContatoEntity } from '../entrevista/entities/registrar-contato.entity';
import { CreateRegistroVagasDto } from '../escola/dto/create-registro-vagas.dto';
import { VagaEntity } from '../escola/entities/vaga.entity';
import { VagasService } from '../escola/services/vagas.service';
import {
  NivelAcesso,
  TipoVinculoInstituicao,
} from '../pessoa/entities/enums/pessoa.enum';
import { FuncionarioEntity } from '../pessoa/entities/funcionario.entity';
import { CreateReservaVagaDto } from './dto/create-reserva-vaga.dto';
import { UpdateReservaVagaDadosMatriculaDto } from './dto/update-reserva-vaga-dados-matricula.dto';
import { UpdateReservaVagaStatusDto } from './dto/update-reserva-vaga-status.dto';
import { CodigoReservaVagaEntity } from './entities/codigo-reserva-vaga.entity';
import { ReservaVagaEntity } from './entities/reserva-vaga.entity';
import { ReservaVagaStatusEnum } from './enums/reserva-vaga-status.enum';

@Injectable()
export class ReservaVagaService {
  constructor(
    @Inject('RESERVA_VAGA_REPOSITORY')
    private reservaVagaRepository: Repository<ReservaVagaEntity>,
    @Inject('CODIGO_RESERVA_VAGA_REPOSITORY')
    private codigoReservaVagaRepository: Repository<CodigoReservaVagaEntity>,
    @Inject('ENTREVISTA_REPOSITORY')
    private entrevistaRepository: Repository<EntrevistaEntity>,
    @Inject('REGISTRO_CONTATO_REPOSITORY')
    private registroContatoRepository: Repository<RegistrarContatoEntity>,
    private vagasService: VagasService,
    private databaseContext: DatabaseContextService,
  ) { }

  async findOne(
    acessoControl: AcessoControl | null,
    id: string,
  ): Promise<ReservaVagaEntity> {
    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'reserva_vaga:read',
        this.reservaVagaRepository.createQueryBuilder('reserva_vaga'),
        id,
      );
    }

    const entity = await this.reservaVagaRepository.findOne({
      where: {
        id,
      },
      relations: [
        'vaga.turma',
        'vaga.turma.etapa',
        'vaga.escola.endereco',
        'vaga.escola.contato',
        'vaga.escola.secretariaMunicipal.endereco.cidade.estado',
        'vaga.escola.secretariaMunicipal.contato',
        'crianca.responsavel',
        'crianca.endereco.cidade.estado',
        'crianca.contato',
        'entrevista.matchCriterios.criterio',
        'registroContato',
        'funcionario.pessoa',
      ],
    });

    if (!entity) {
      throw new NotFoundException(`Reserva de Vaga não encontrada!`);
    }

    entity.entrevista.matchCriterios = entity.entrevista.matchCriterios.filter(
      (i) => i.ativo === true && i.versaoMaisRecente === true,
    );

    // Adiciona o apelido da etapa
    if (entity.vaga?.turma?.etapa && entity.vaga?.escola?.secretariaMunicipal) {
      await this.addApelidoToEtapa(
        entity.vaga.turma.etapa,
        entity.vaga.escola.secretariaMunicipal.id,
      );
    }

    return entity;
  }

  // Rota para verificar se existe uma reserva de vaga para a entrevista e bloquear o edite no front caso haja
  async findOneByEntrevistaId(
    acessoControl: AcessoControl | null,
    entrevistaId: string,
  ): Promise<ReservaVagaEntity> {
    const entity = await this.reservaVagaRepository.findOne({
      where: {
        entrevista: { id: entrevistaId },
      },
      relations: ['entrevista', 'crianca'],
      select: {
        id: true,
        entrevista: {
          id: true,
        },
        crianca: {
          id: true,
          cpf: true,
        },
      },
    });

    if (!entity) {
      throw new NotFoundException(
        `Reserva de Vaga não encontrada para a entrevista buscada!`,
      );
    }

    await acessoControl.ensureCanReachTarget(
      'reserva_vaga:read',
      this.reservaVagaRepository.createQueryBuilder('reserva_vaga'),
      entity.id,
    );

    return entity;
  }

  async findAll(
    acessoControl: AcessoControl,
    query: PaginateQuery,
  ): Promise<Paginated<ReservaVagaEntity>> {
    const qbAcesso =
      this.reservaVagaRepository.createQueryBuilder('reserva_vaga');

    await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      'reserva_vaga:read',
      qbAcesso,
    );

    if (query?.filter?.startDateOccupation) {
      qbAcesso.andWhere(
        'DATE(reserva_vaga.createdAt) >= :startDateOccupation',
        {
          startDateOccupation: query.filter.startDateOccupation,
        },
      );
    }

    if (query?.filter?.endDateOccupation) {
      qbAcesso.andWhere('DATE(reserva_vaga.createdAt) <= :endDateOccupation', {
        endDateOccupation: query.filter.endDateOccupation,
      });
    }

    const paginatedResults = await paginate(query, qbAcesso, {
      ...paginateConfig,
      loadEagerRelations: true,
      relations: [
        'vaga',
        'vaga.escola',
        'vaga.escola.secretariaMunicipal',
        'vaga.turma',
        'vaga.turma.etapa',
        'crianca',
      ],
      searchableColumns: [
        'status',
        'vaga.anoLetivo',
        'crianca.nome',
        'vaga.escola.razaoSocial',
        'vaga.escola.nomeFantasia',
        'vaga.turma.turno',
        'vaga.turma.nome',
        'createdAt',
      ],
      filterableColumns: {
        status: [FilterOperator.EQ],
        'vaga.anoLetivo': [FilterOperator.EQ],
        'vaga.escola.id': [FilterOperator.EQ],
        'vaga.escola.secretariaMunicipal.id': [FilterOperator.EQ],
        'vaga.turma.etapa.id': [FilterOperator.EQ],
        'vaga.turma.turno': [FilterOperator.EQ],
        'vaga.turma.id': [FilterOperator.EQ],
      },
      // Remove o select específico para carregar as relações completas
      // select: [
      //   'id',
      //   'status',
      //   'matricula',
      //   'observacao',
      //   'dataReferencia',
      //   'createdAt',
      //   'updatedAt',
      //   'crianca.id',
      //   'crianca.nome',
      //   'vaga.id',
      //   'vaga.anoLetivo',
      //   'vaga.escola.id',
      //   'vaga.escola.nomeFantasia',
      //   'vaga.escola.razaoSocial',
      //   'vaga.turma.id',
      //   'vaga.turma.nome',
      //   'vaga.turma.turno',
      //   'vaga.turma.etapa.id',
      //   'vaga.turma.etapa.nome',
      // ],
    });

    // Busca os apelidos das etapas se houver reservas
    if (paginatedResults.data.length > 0) {
      await this.addApelidosToReservas(paginatedResults.data);
    }

    return paginatedResults;
  }

  async create(
    acessoControl: AcessoControl | null,
    dto: CreateReservaVagaDto,
  ): Promise<ReservaVagaEntity> {
    if (acessoControl) {
      await acessoControl.ensureCanPerform('reserva_vaga:create', dto);
    }

    const [entrevista, vaga, registroContato] = await Promise.all([
      this.entrevistaRepository.findOneBy({
        id: dto.entrevista.id,
        crianca: { id: dto.crianca.id },
      }),
      this.vagasService.findOne(null, dto.vaga.id),
      this.registroContatoRepository.findOneBy({
        entrevista: { id: dto.entrevista.id },
        ligacaoAceita: 'Vaga Aceita',
      }),
    ]);

    this.validarEntidades(entrevista, vaga, registroContato);
    this.validarCorrespondenciaVagaEntrevista(vaga, entrevista);

    const codigoReservaVagaStr = await this.codigoReservaVaga(
      vaga.escola.secretariaMunicipal.id,
    );

    const reservaVaga = this.reservaVagaRepository.create({
      ...dto,
      id: uuidv4(),
      codigoReservaVaga: codigoReservaVagaStr,
      entrevista: entrevista,
      registroContato: registroContato,
    });
    const novaReserva = await this.reservaVagaRepository.save(reservaVaga);

    await this.alterarStatusReservasAnteriores(
      dto.crianca.id,
      entrevista.secretariaMunicipal.id,
      novaReserva.id,
    );

    await this.vagasService.update(null, novaReserva.vaga.id, { ativa: false });

    await this.entrevistaRepository.update(entrevista.id, {
      elegivelParaFila: false,
      elegivelParaFila2: false,
      status: EntrevistaStatusEnum.CONCLUIDO,
    });

    await this.dispararEventosPosReserva(novaReserva, entrevista);

    return novaReserva;
  }

  async delete(
    acessoControl: AcessoControl,
    id: string,
  ): Promise<ReservaVagaEntity> {
    const entity = await this.findOne(acessoControl, id);

    await acessoControl.ensureCanReachTarget(
      'reserva_vaga:delete',
      this.reservaVagaRepository.createQueryBuilder('reserva_vaga'),
      id,
    );

    if (entity.status !== ReservaVagaStatusEnum.PENDENTE) {
      throw new NotFoundException(
        `Reserva de Vaga não pode ser deletada pois já esta com o status ${entity.status}!`,
      );
    }

    await this.reservaVagaRepository.remove(entity);

    await this.vagasService.update(null, entity.vaga.id, {
      ativa: true,
    });

    const outraEntrevista = await this.entrevistaRepository.findOne({
      where: {
        crianca: { id: entity.crianca.id },
        secretariaMunicipal: { id: entity.entrevista.secretariaMunicipal.id },

        status: In([
          EntrevistaStatusEnum.AGUARDANDO,
          EntrevistaStatusEnum.CONCLUIDO,
        ]),
        id: Not(entity.id),
      },
      select: { id: true },
    });

    const entrevistaStatus = outraEntrevista
      ? EntrevistaStatusEnum.TRANSFERENCIA
      : EntrevistaStatusEnum.AGUARDANDO;

    if (
      entity.entrevista.etapa &&
      ((entity.entrevista.preferenciaUnidade &&
        entity.entrevista.preferenciaTurno) ||
        (entity.entrevista.preferenciaUnidade2 &&
          entity.entrevista.preferenciaTurno2))
    ) {
      await this.entrevistaRepository.update(entity.entrevista.id, {
        elegivelParaFila: true,
        elegivelParaFila2: true,
        status: entrevistaStatus,
      });
      eventBus.emit('criarFila', entity.entrevista);
    }

    return entity;
  }

  async updateStatusReservaVaga(
    acessoControl: AcessoControl,
    id: string,
    dto: UpdateReservaVagaStatusDto,
  ): Promise<ReservaVagaEntity> {
    await acessoControl.ensureCanReachTarget(
      'reserva_vaga:update:status',
      this.reservaVagaRepository.createQueryBuilder('reserva_vaga'),
      id,
      dto,
    );

    let entity: ReservaVagaEntity;
    if (dto.status === ReservaVagaStatusEnum.PENDENTE) {
      entity = await this.reservaVagaRepository.findOne({
        where: { id, status: ReservaVagaStatusEnum.DEFERIDA },
      });
      if (!entity) {
        throw new NotFoundException(
          `Reserva de Vaga não encontrada ou não está DEFERIDA!`,
        );
      }
    } else {
      entity = await this.reservaVagaRepository.findOne({
        where: { id, status: ReservaVagaStatusEnum.PENDENTE },
      });
      if (!entity) {
        throw new NotFoundException(
          `Reserva de Vaga não encontrada ou não esta mais PENDENTE!`,
        );
      }
    }

    const updatedEntityData: Partial<ReservaVagaEntity> = {
      ...entity,
      status: dto.status,
      dataReferencia: dto.dataReferencia,
      updatedAt: new Date(),
    };

    if (dto.status === ReservaVagaStatusEnum.DEFERIDA) {
      if (dto?.matricula) {
        updatedEntityData.matricula = dto?.matricula;
      } else {
        throw new NotFoundException(
          `Matrícula é obrigatória para status DEFERIDA!`,
        );
      }
    } else if (dto.status === ReservaVagaStatusEnum.INDEFERIDA) {
      const dtoRegistroVagas = {
        dataHoraVaga: entity.vaga.registroVagas.dataHoraVaga,
        servidor: entity.vaga.registroVagas.servidor,
        anoLetivo: entity.vaga.registroVagas.anoLetivo,
        escola: entity.vaga.registroVagas.escola,
        turma: entity.vaga.registroVagas.turma,
        quantidadeVagas: 1,
      } as CreateRegistroVagasDto;

      if (dto?.observacao && dto?.substatus) {
        updatedEntityData.observacao = dto?.observacao;
        updatedEntityData.substatus = dto?.substatus;
        eventBus.emit('regitroVagas:criarRegistroVagas', dtoRegistroVagas);
      } else {
        throw new NotFoundException(
          `Observação e substatus são obrigatórios para status ${dto.status}!`,
        );
      }
    } else if (dto.status === ReservaVagaStatusEnum.PENDENTE) {
      updatedEntityData.observacao = null;
      updatedEntityData.matricula = null;
      updatedEntityData.dataReferencia = null;
    }

    const updatedEntity = await this.reservaVagaRepository.save(
      updatedEntityData,
    );

    return updatedEntity;
  }

  async updateDadosMatriculaReservaVaga(
    acessoControl: AcessoControl,
    id: string,
    dto: UpdateReservaVagaDadosMatriculaDto,
  ): Promise<ReservaVagaEntity> {
    await acessoControl.ensureCanReachTarget(
      'reserva_vaga:update:status',
      this.reservaVagaRepository.createQueryBuilder('reserva_vaga'),
      id,
      dto,
    );

    const entity = await this.reservaVagaRepository.findOne({
      where: { id, status: ReservaVagaStatusEnum.DEFERIDA },
    });

    if (!entity) {
      throw new NotFoundException(
        `Reserva de Vaga não encontrada ou não está DEFERIDA!`,
      );
    }

    const updatedEntityData: Partial<ReservaVagaEntity> = {
      ...entity,
      observacao: null,
      matricula: dto.matricula,
      updatedAt: new Date(),
    };

    const updatedEntity = await this.reservaVagaRepository.save(
      updatedEntityData,
    );

    return updatedEntity;
  }

  private async generateVoucher(id: string): Promise<any> {
    const entity = await this.reservaVagaRepository.findOne({
      where: {
        id,
      },
      relations: [
        'vaga.turma',
        'vaga.turma.etapa',
        'vaga.escola.endereco',
        'vaga.escola.contato',
        'vaga.escola.documentos',
        'vaga.escola.horariosFuncionamento',
        'vaga.escola.secretariaMunicipal.endereco.cidade.estado',
        'vaga.escola.secretariaMunicipal.contato',
        'crianca.responsavel',
        'crianca.endereco.cidade.estado',
        'crianca.contato',
        'entrevista.matchCriterios.criterio',
        'registroContato',
        'funcionario.pessoa',
      ],
    });

    if (!entity) {
      throw new NotFoundException(`Reserva de Vaga não encontrada!`);
    }

    entity.entrevista.matchCriterios = entity.entrevista.matchCriterios.filter(
      (i) => i.ativo === true && i.versaoMaisRecente === true,
    );

    // Adiciona o apelido da etapa para incluir no comprovante
    if (entity.vaga?.turma?.etapa && entity.vaga?.escola?.secretariaMunicipal) {
      await this.addApelidoToEtapa(
        entity.vaga.turma.etapa,
        entity.vaga.escola.secretariaMunicipal.id,
      );
    }

    const secretariaMunicipal = {
      nomeFantasia:
        entity.vaga.escola.secretariaMunicipal.nomeFantasia || '----------',
      logradouro:
        entity.vaga.escola.secretariaMunicipal.endereco.logradouro ||
        '----------',
      cep: entity.vaga.escola.secretariaMunicipal.endereco.cep || '----------',
      cidade:
        entity.vaga.escola.secretariaMunicipal.endereco.cidade.nome ||
        '----------',
      estado:
        entity.vaga.escola.secretariaMunicipal.endereco.cidade.estado.uf ||
        '----------',
      email:
        entity.vaga.escola.secretariaMunicipal.contato.emails[0].email ||
        '----------',
    };

    const crianca = {
      nome: entity.crianca.nome || '----------',
      cpf: entity.crianca.cpf || '----------',
      sexo: entity.crianca.sexo || '----------',
      dataNascimento:
        entity.crianca.dataNascimento.toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }) || '----------',
      responsavelNome: entity.crianca.responsavel.nomeRes || '----------',
      responsavelCpf: entity.crianca.responsavel.cpfRes || '----------',
      logradouro: entity.crianca.endereco.logradouro || '----------',
      numero: entity.crianca.endereco.numero || '----------',
      bairro: entity.crianca.endereco.bairro || '----------',
      cep: entity.crianca.endereco.cep || '----------',
      cidade: entity.crianca.endereco.cidade.nome || '----------',
      estado: entity.crianca.endereco.cidade.estado.uf || '----------',
    };

    const criterios = entity.entrevista.matchCriterios.map(
      (criterio) => criterio.criterio.nome,
    );

    // Retornar critérios em grupos de 4 para formar linha no comprovante de corpo de email
    const groupedCriterios = await this.groupItems(criterios, 4);

    // Retornar documentos em grupos de 4 para formar linha no comprovante de corpo de email
    const documentos =
      entity.vaga.escola.documentos?.map((doc) => doc.nome) || [];
    const groupedDocumentos = await this.groupItems(documentos, 4);

    // Retornar horarios de funcionamento em grupos de 4 para formar linha no comprovante de corpo de email
    const horariosFuncionamento =
      entity.vaga.escola.horariosFuncionamento?.map(
        (horario) =>
          `${horario.diaSemana} | ${horario.inicioManha} ás ${horario.fimManha} | ${horario.inicioTarde} ás ${horario.fimTarde}`,
      ) || [];
    const groupedHorariosFuncionamento = await this.groupItems(
      horariosFuncionamento,
      4,
    );

    const escola = {
      nomeFantasia: entity.vaga.escola.nomeFantasia || '----------',
      cnpj: entity.vaga.escola.cnpjEscola || '----------',
      logradouro: entity.vaga.escola.endereco.logradouro || '----------',
      numero: entity.vaga.escola.endereco.numero || '----------',
      bairro: entity.vaga.escola.endereco.bairro || '----------',
      cep: entity.vaga.escola.endereco.cep || '----------',
      telefone1: entity.vaga.escola.contato.telefones[0] || {
        numero: '----------',
        tipo: 'Telefone',
      },
      telefone2: entity.vaga.escola.contato.telefones[1] || {
        numero: '----------',
        tipo: 'Telefone',
      },
      email: entity.vaga.escola.contato.emails[0].email || '----------',
      documentos: groupedDocumentos,
      horariosFuncionamento: groupedHorariosFuncionamento,
      prazoMatricula: entity.vaga.escola.prazoMatricula || 3,
    };

    // Subtrai TZ_OFFSET horas para ajustar com o timezone de PVH
    const date = new Date(entity.createdAt);
    date.setHours(date.getHours() - TZ_OFFSET);

    const reserva = {
      dataReserva: date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      horaReserva: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      funcionarioResponsavel: entity.funcionario.pessoa.nome || '----------',
      funcionarioResponsavelCargo: entity.funcionario.cargo || '----------',
      anoLetivo: entity.vaga.anoLetivo || '----------',
      etapa: {
        nome: entity.vaga.turma.etapa.nome || '----------',
        apelido: (entity.vaga.turma.etapa as any)?.apelido || null, // Inclui o apelido no comprovante
      },
      turma: entity.vaga.turma.nome || '----------',
      turno: entity.vaga.turma.turno || '----------',
      resultadoContato: entity.registroContato.ligacaoAceita || '----------',
      nomeContato: entity.registroContato.nomeContato || '----------',
      emailResponsavel: entity.crianca.contato.emails[0].email || '----------',
      telefoneResponsavel: entity.crianca.contato.telefones[0] || '----------',
      tipoContato: entity.registroContato.tipoContato || '----------',
    };

    const comprovante = {
      id: entity.id,
      codigoReservaVaga: entity.codigoReservaVaga,
      dataEmissao: await this.getDataEmissaoUTCMinus4(),
      secretariaMunicipal,
      crianca,
      criterios,
      groupedCriterios,
      escola,
      reserva,
    };

    return comprovante;
  }

  private async generateNotificationEmail(id: string): Promise<any> {
    const entity = await this.reservaVagaRepository.findOne({
      where: { id },
      relations: [
        'crianca',
        'vaga',
        'vaga.escola',
        'vaga.escola.secretariaMunicipal',
        'vaga.turma',
        'vaga.turma.etapa',
      ],
    });

    // Adiciona o apelido da etapa para incluir na notificação
    if (entity.vaga?.turma?.etapa && entity.vaga?.escola?.secretariaMunicipal) {
      await this.addApelidoToEtapa(
        entity.vaga.turma.etapa,
        entity.vaga.escola.secretariaMunicipal.id,
      );
    }

    const funcionarios = await this.databaseContext.funcionarioRepository
      .createQueryBuilder('funcionario')
      .leftJoin('funcionario.usuario', 'usuario')
      .leftJoin('funcionario.pessoa', 'pessoa')
      .leftJoin('pessoa.contato', 'contato')
      .innerJoin('funcionario.unidadesEscolares', 'unidadesEscolares')
      .where('unidadesEscolares.id = :unidadesEscolares', {
        unidadesEscolares: entity.vaga.escola.id,
      })
      .andWhere('funcionario.tipoVinculo = :tipoVinculo', {
        tipoVinculo: TipoVinculoInstituicao.UnidadeEscolar,
      })
      .andWhere('usuario.nivelAcesso = :nivelAcesso', {
        nivelAcesso: NivelAcesso.GestorCreche,
      })
      .andWhere('usuario.situacaoCadastral = :situacaoCadastral', {
        situacaoCadastral: true,
      })
      .addSelect(['funcionario.id', 'pessoa.nome', 'contato'])
      .getMany();

    const fTimePortuguese = (timeStandard: string) => {
      const timeSplit = timeStandard.split(':');
      const [hour, minute] = timeSplit.map((i) => +i);
      if (minute === 0) {
        return `${hour}h`;
      }
      return `${hour}h${minute}`;
    };

    function getMainAddress(funcionario: FuncionarioEntity): string {
      return Array.from(funcionario.pessoa.contato.emails).sort((a, b) => {
        if (a.principal === b.principal) {
          return 0;
        }
        if (b.principal) {
          return 1;
        }
        return -1;
      })?.[0].email;
    }

    const notification = {
      id: entity.id,
      dataHoraVaga: entity.vaga.dataHoraVaga,
      anoLetivo: entity.vaga.anoLetivo,
      escola: {
        nomeFantasia: entity.vaga.escola.nomeFantasia,
        cnpj: entity.vaga.escola.cnpjEscola,
      },
      turma: {
        nome: entity.vaga.turma.nome,
        etapa: {
          nome: entity.vaga.turma.etapa.nome,
          apelido: (entity.vaga.turma.etapa as any)?.apelido || null, // Inclui o apelido na notificação
        },
        turno: entity.vaga.turma.turno,
      },
      crianca: {
        nome: entity.crianca.nome,
        cpf: entity.crianca.cpf,
      },
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      interessados: [
        ...funcionarios
          .map(
            (funcionario): Address => ({
              name: funcionario.pessoa.nome,
              address: getMainAddress(funcionario),
            }),
          )
          .filter((i) => Boolean(i.address)),
      ],
    };

    return notification;
  }

  private async groupItems(items, itemsPerRow) {
    let result = [];
    for (let i = 0; i < items.length; i += itemsPerRow) {
      result.push(items.slice(i, i + itemsPerRow));
    }
    return result;
  }

  private async codigoReservaVaga(
    secretaria_municipal_id: any,
  ): Promise<string> {
    const currentYear = new Date().getFullYear().toString();

    let codigoReservaVaga = await this.codigoReservaVagaRepository.findOne({
      where: {
        ano: currentYear,
        secretariaMunicipal: { id: secretaria_municipal_id },
      },
    });

    if (codigoReservaVaga) {
      codigoReservaVaga.count += 1;
    } else {
      codigoReservaVaga = this.codigoReservaVagaRepository.create({
        id: uuidv4(),
        count: 1,
        ano: currentYear,
        secretariaMunicipal: secretaria_municipal_id,
      });
    }

    await this.codigoReservaVagaRepository.save(codigoReservaVaga);

    const codigoReservaVagaStr = `${codigoReservaVaga.count}/${currentYear}`;
    return codigoReservaVagaStr;
  }

  private async getDataEmissaoUTCMinus4(): Promise<string> {
    const agora: Date = new Date();

    const utc: number = agora.getTime() + agora.getTimezoneOffset() * 60000;

    const utcMinus4: Date = new Date(utc - TZ_OFFSET * 3600000);

    return utcMinus4.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });
  }

  private async addApelidosToReservas(reservas: ReservaVagaEntity[]) {
    // Agrupa reservas por secretaria municipal para buscar os apelidos
    const reservasPorSecretaria = new Map<string, ReservaVagaEntity[]>();

    reservas.forEach((reserva) => {
      const secretariaId = reserva.vaga?.escola?.secretariaMunicipal?.id;
      if (secretariaId) {
        if (!reservasPorSecretaria.has(secretariaId)) {
          reservasPorSecretaria.set(secretariaId, []);
        }
        reservasPorSecretaria.get(secretariaId)!.push(reserva);
      }
    });

    // Busca os apelidos para cada secretaria
    for (const [secretariaId, reservasSecretaria] of reservasPorSecretaria) {
      await this.addApelidosToReservasBySecretaria(
        reservasSecretaria,
        secretariaId,
      );
    }
  }

  private async addApelidosToReservasBySecretaria(
    reservas: ReservaVagaEntity[],
    secretariaId: string,
  ) {
    // Coleta todas as etapas únicas
    const etapaIds = [
      ...new Set(
        reservas
          .map((reserva) => reserva.vaga?.turma?.etapa?.id)
          .filter(Boolean),
      ),
    ];

    if (etapaIds.length === 0) {
      return;
    }

    // Busca os apelidos das etapas
    const apelidosQuery = await this.reservaVagaRepository
      .createQueryBuilder()
      .select('sme.etapa_id', 'etapaId')
      .addSelect('sme.apelido', 'apelido')
      .from('secretaria_municipal_etapa', 'sme')
      .where('sme.secretaria_municipal_id = :secretariaId', { secretariaId })
      .andWhere('sme.etapa_id IN (:...etapaIds)', { etapaIds })
      .getRawMany();

    const apelidosMap = new Map();
    apelidosQuery.forEach((row) => {
      apelidosMap.set(row.etapaId, row.apelido);
    });

    // Adiciona os apelidos nas etapas
    reservas.forEach((reserva) => {
      if (reserva.vaga?.turma?.etapa) {
        (reserva.vaga.turma.etapa as any).apelido =
          apelidosMap.get(reserva.vaga.turma.etapa.id) || null;
      }
    });
  }

  private async addApelidoToEtapa(etapa: any, secretariaId: string) {
    if (!etapa?.id) {
      return;
    }

    // Busca o apelido da etapa
    const apelidoQuery = await this.reservaVagaRepository
      .createQueryBuilder()
      .select('sme.apelido', 'apelido')
      .from('secretaria_municipal_etapa', 'sme')
      .where('sme.secretaria_municipal_id = :secretariaId', { secretariaId })
      .andWhere('sme.etapa_id = :etapaId', { etapaId: etapa.id })
      .getRawOne();

    if (apelidoQuery) {
      (etapa as any).apelido = apelidoQuery.apelido;
    }
  }

  private validarCorrespondenciaVagaEntrevista(
    vaga: VagaEntity,
    entrevista: EntrevistaEntity,
  ): void {
    const isUnidadeOk =
      vaga.escola.id === entrevista?.preferenciaUnidade?.id ||
      vaga.escola.id === entrevista?.preferenciaUnidade2?.id;
    if (!isUnidadeOk) {
      throw new NotFoundException(
        `A Unidade Escolar da vaga não corresponde a uma das preferências da Entrevista!`,
      );
    }

    const isTurnoOk =
      vaga.turma.turno === entrevista?.preferenciaTurno ||
      vaga.turma.turno === entrevista?.preferenciaTurno2;
    if (!isTurnoOk) {
      throw new NotFoundException(
        `O Turno da Vaga não corresponde a uma das preferências da Entrevista!`,
      );
    }

    if (vaga.turma.etapa.id !== entrevista.etapa?.id) {
      throw new NotFoundException(
        `A Etapa da Vaga não corresponde à Etapa da Entrevista!`,
      );
    }

    if (vaga.anoLetivo !== entrevista.anoLetivo) {
      throw new NotFoundException(
        `O Ano Letivo da Vaga não corresponde ao Ano Letivo da Entrevista!`,
      );
    }
  }

  private validarEntidades(
    entrevista: EntrevistaEntity,
    vaga: VagaEntity,
    registroContato: any,
  ): void {
    if (!entrevista) {
      throw new NotFoundException(
        `A entrevista informada não foi encontrada ou não corresponde à criança.`,
      );
    }
    if (!vaga) {
      throw new NotFoundException(`A vaga informada não foi encontrada.`);
    }
    if (!registroContato) {
      throw new NotFoundException(
        `Registro de Contato com 'Vaga Aceita' não encontrado para a entrevista.`,
      );
    }
  }

  private async alterarStatusReservasAnteriores(
    criancaId: string,
    secretariaId: string,
    novaReservaId: string,
  ): Promise<void> {
    const reservasParaAtualizar = await this.reservaVagaRepository.find({
      select: ['id'],
      where: {
        crianca: { id: criancaId },
        entrevista: { secretariaMunicipal: { id: secretariaId } },
        status: Not(ReservaVagaStatusEnum.TRANSFERIDA),
        id: Not(novaReservaId),
      },
    });

    if (reservasParaAtualizar.length > 0) {
      const ids = reservasParaAtualizar.map((r) => r.id);
      await this.reservaVagaRepository.update(ids, {
        status: ReservaVagaStatusEnum.TRANSFERIDA,
      });
    }
  }

  private async dispararEventosPosReserva(
    reserva: ReservaVagaEntity,
    entrevista: EntrevistaEntity,
  ): Promise<void> {
    const [comprovante, notificationEmail] = await Promise.all([
      this.generateVoucher(reserva.id),
      this.generateNotificationEmail(reserva.id),
    ]);

    eventBus.emit('mailer:enviarComprovanteReservaVaga', comprovante);
    eventBus.emit('mailer:enviarNotificacaoReservaVaga', notificationEmail);
    eventBus.emit('whatsapp:enviarComprovanteReservaVaga', comprovante);
    eventBus.emit('whatsapp:enviarNotificacaoReservaVaga', notificationEmail);

    if (
      entrevista.etapa &&
      ((entrevista.preferenciaUnidade && entrevista.preferenciaTurno) ||
        (entrevista.preferenciaUnidade2 && entrevista.preferenciaTurno2))
    ) {
      eventBus.emit('criarFila', entrevista);
    }
  }
}
