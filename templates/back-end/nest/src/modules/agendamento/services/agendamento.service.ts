import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import {
  addDays,
  format,
  getHours,
  getMinutes,
  isValid,
  parse,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { paginateConfig } from '../../../config/paginate.config';
import { TZ_OFFSET } from '../../../config/TZ_OFFSET';
import { generateTimes } from '../../../helpers/dates/generateTimes';
import { getTodayWithTimezoneOffset } from '../../../helpers/dates/getTodayWithTimezoneOffset';
import eventBus from '../../../helpers/eventEmitter.helper';
import { AcessoControl } from '../../../infrastructure/acesso-control';
import { DatabaseContextService } from '../../../infrastructure/database-context/database-context.service';
import { CriteriosConfiguracaoService } from '../../configuracao-criterio/criterios-configuracao.service';
import { EntrevistaService } from '../../entrevista/services/entrevista.service';
import { LocalAtendimentoEntity } from '../../local-atendimento/local-atendimento.entity';
import { CreateAgendamentoDto } from '../dto/create-agendamento.dto';
import { CreateGerenciaAgendamentoDto } from '../dto/create-gerencia-agendamento.dto';
import { UpdateAgendamentoDto } from '../dto/update-agendamento.dto';
import { AgendamentoEntity } from '../entities/agendamento.entity';
import { GerenciaAgendamentoService } from './gerencia-agendamentos.service';
import { HorariosAgendamentoService } from './horarios-agendamento.service';

@Injectable()
export class AgendamentoService {
  constructor(
    @Inject('AGENDAMENTO_REPOSITORY')
    private repository: Repository<AgendamentoEntity>,

    @Inject('LOCAL_ATENDIMENTO_REPOSITORY')
    private localAtendimentoRepository: Repository<LocalAtendimentoEntity>,

    @Inject(forwardRef(() => GerenciaAgendamentoService))
    private gerenciaAgendamentoService: GerenciaAgendamentoService,

    @Inject(forwardRef(() => HorariosAgendamentoService))
    private horariosAgendamentosService: HorariosAgendamentoService,

    private criteriosConfiguracaoService: CriteriosConfiguracaoService,

    private entrevistaService: EntrevistaService,
    private databaseContextService: DatabaseContextService,
  ) { }

  private async generateVoucher(id: string): Promise<any> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: {
        localAtendimento: {
          endereco: {
            cidade: {
              estado: true,
            },
          },
          secretariaMunicipal: {
            endereco: {
              cidade: {
                estado: true,
              },
            },
            contato: true,
          },
          contato: true,
        },
        secretariaMunicipal: {
          endereco: {
            cidade: true,
          },
          contato: true,
        },
      },
    });

    const localAtendimento = entity?.localAtendimento;

    const secretariaMunicipal =
      localAtendimento?.secretariaMunicipal ?? entity.secretariaMunicipal;

    const secretariaMunicipalId = secretariaMunicipal?.id;

    const criterios =
      await this.criteriosConfiguracaoService.publicCurrentCriterios(
        secretariaMunicipalId,
      );

    const agendamento = {
      dataEmissao: await this.getDataEmissaoUTCMinus4(),
      dataAgendamento:
        entity.data.toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }) || '----------',
      horarioAgendamento: entity.horario || '----------',
      telefone: entity.telefone || '----------',
      responsavel: {
        nome: entity.nomeRes || '----------',
        email: entity.email || '----------',
      },
      crianca: {
        nome: entity.nomeCrianca || '----------',
      },

      exibirTelefoneLocalAtendimento:
        Boolean(localAtendimento?.contato?.telefones?.[0]?.numero) &&
        localAtendimento?.contato?.telefones?.[0]?.numero !==
        (secretariaMunicipal?.contato?.telefones?.[0]?.numero ?? null),

      localAtendimento: {
        nome: localAtendimento?.nome ?? '----------',
        endereco: {
          logradouro: localAtendimento?.endereco?.logradouro ?? '----------',
          numero: localAtendimento?.endereco?.numero ?? '----------',
          bairro: localAtendimento?.endereco?.bairro ?? '----------',
          cidade: localAtendimento?.endereco?.cidade?.nome ?? '----------',
          estado:
            localAtendimento?.endereco?.cidade?.estado?.nome ?? '----------',
        },
        contato: {
          telefoneNumero:
            localAtendimento?.contato?.telefones?.[0]?.numero || '----------',

          email: localAtendimento?.contato?.emails?.[0]?.email || '----------',
        },
      },

      secretariaMunicipal: {
        nomeFantasia: secretariaMunicipal?.nomeFantasia || '----------',
        contato: {
          telefoneNumero:
            secretariaMunicipal?.contato?.telefones?.[0]?.numero ||
            '----------',

          email:
            secretariaMunicipal?.contato?.emails?.[0]?.email || '----------',
        },
      },

      criterios: criterios,
    };

    return agendamento;
  }

  private getDiaSemana(date: Date, pronum = true) {
    const label = format(date, 'eeee', { locale: ptBR }).toLowerCase();

    const pronumMapping = {
      0: 'no', // domingo,
      1: 'na', // segunda,
      2: 'na', // terça,
      3: 'na', // quarta,
      4: 'na', // quinta,
      5: 'na', // sexta,
      6: 'no', // sábado,
    };

    return `${pronum ? pronumMapping[date.getUTCDay()] : ''} ${label}`.trim();
  }

  private async generateVoucherUnscheduledAppointment(
    id: string,
  ): Promise<any> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: [
        'localAtendimento',
        'localAtendimento.secretariaMunicipal',
        'localAtendimento.endereco',
        'localAtendimento.endereco.cidade',
        'localAtendimento.endereco.cidade.estado',
        'localAtendimento.contato',
        'localAtendimento.secretariaMunicipal.endereco',
        'localAtendimento.secretariaMunicipal.endereco.cidade',
        'localAtendimento.secretariaMunicipal.endereco.cidade.estado',
        'localAtendimento.secretariaMunicipal.contato',
      ],
    });

    const endereco =
      entity.localAtendimento.endereco ||
      entity.localAtendimento.secretariaMunicipal.endereco;

    return {
      diaSemana: this.getDiaSemana(entity.data),

      data: format(entity.data, 'dd/MM/yyyy'),
      hora: entity.horario.replace(':', 'h'),

      dataEmissao: await this.getDataEmissaoUTCMinus4(),

      responsavel: {
        nome: entity.nomeRes,
        email: entity.email,
      },

      crianca: {
        nome: entity.nomeCrianca,
      },

      secretariaMunicipal: {
        nomeFantasia: entity.localAtendimento.secretariaMunicipal.nomeFantasia,
        email:
          entity.localAtendimento.contato?.emails?.[0]?.email ??
          entity.localAtendimento.secretariaMunicipal.contato?.emails?.[0]
            ?.email ??
          'Não informado.',
        telefone:
          entity.localAtendimento.contato?.telefones?.[0]?.numero ??
          entity.localAtendimento.secretariaMunicipal.contato?.telefones?.[0]
            ?.numero ??
          'Não informado.',
        endereco: `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}. ${endereco.cidade.nome} - ${endereco.cidade.estado.nome}.`,
      },
    };
  }

  async generateVoucherChangedAppointment(
    id: string,
    before: Pick<AgendamentoEntity, 'data' | 'horario'>,
  ): Promise<any> {
    const after = await this.repository.findOne({
      where: { id },
      relations: [
        'localAtendimento',
        'localAtendimento.secretariaMunicipal',
        'localAtendimento.endereco',
        'localAtendimento.endereco.cidade',
        'localAtendimento.endereco.cidade.estado',
        'localAtendimento.contato',
        'localAtendimento.secretariaMunicipal.endereco',
        'localAtendimento.secretariaMunicipal.endereco.cidade',
        'localAtendimento.secretariaMunicipal.endereco.cidade.estado',
        'localAtendimento.secretariaMunicipal.contato',
        // Manter para compatibilidade
        'secretariaMunicipal.endereco.cidade.estado',
        'secretariaMunicipal.contato',
      ],
    });

    // Prioriza endereco do localAtendimento, depois secretariaMunicipal
    const endereco =
      after.localAtendimento?.endereco ||
      after.localAtendimento?.secretariaMunicipal?.endereco ||
      after.secretariaMunicipal?.endereco;

    return {
      responsavel: {
        nome: after.nomeRes,
        email: after.email,
      },

      diaSemanaAnterior: this.getDiaSemana(before.data),
      dataAnterior: format(before.data, 'dd/MM/yyyy'),
      horaAnterior: before.horario.replace(':', 'h'),

      crianca: {
        nome: after.nomeCrianca,
      },

      diaSemanaNovo: this.getDiaSemana(after.data, false),
      dataNova: format(after.data, 'dd/MM/yyyy'),
      horaNova: after.horario.replace(':', 'h'),

      diaSemana: this.getDiaSemana(after.data),

      dataEmissao: await this.getDataEmissaoUTCMinus4(),

      secretariaMunicipal: {
        nomeFantasia:
          after.localAtendimento?.secretariaMunicipal?.nomeFantasia ||
          after.secretariaMunicipal?.nomeFantasia,
        email:
          after.localAtendimento?.contato?.emails?.[0]?.email ??
          after.localAtendimento?.secretariaMunicipal?.contato?.emails?.[0]
            ?.email ??
          after.secretariaMunicipal?.contato?.emails?.[0]?.email ??
          'Não informado.',
        telefone:
          after.localAtendimento?.contato?.telefones?.[0]?.numero ??
          after.localAtendimento?.secretariaMunicipal?.contato?.telefones?.[0]
            ?.numero ??
          after.secretariaMunicipal?.contato?.telefones?.[0]?.numero ??
          'Não informado.',
        endereco: endereco
          ? `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}. ${endereco.cidade.nome} - ${endereco.cidade.estado.nome}.`
          : 'Não informado.',
      },
    };
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

  async findByCpf(cpfCrianca: string): Promise<AgendamentoEntity[]> {
    const agendamentos = await this.repository.find({
      where: { cpfCrianca },
    });

    if (!agendamentos) {
      throw new NotFoundException(` Agendamento não encontrado`);
    }

    return agendamentos;
  }

  async findOne(
    acessoControl: AcessoControl | null,
    id: string,
  ): Promise<AgendamentoEntity> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Agendamento não encontrado`);
    }

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'agendamento:read',
        this.repository.createQueryBuilder('agendamento'),
        entity.id,
      );
    }

    return entity;
  }

  async getAgendamentosFuturos(
    idSecretaria: string,
    includeToday = false,
  ): Promise<AgendamentoEntity[]> {
    const today = getTodayWithTimezoneOffset();

    const consideredDate = includeToday ? today : addDays(today, 1);

    const agendamentos = await this.repository.find({
      where: {
        data: MoreThanOrEqual(consideredDate),
        secretariaMunicipal: { id: idSecretaria },
      },
    });

    return agendamentos;
  }

  async verificarAgendamento(data: CreateAgendamentoDto): Promise<boolean> {
    try {
      const localAtendimentoId =
        data.localAtendimento?.id || data.secretariaMunicipal?.id;

      let gerenciaAgendamento;

      if (data.localAtendimento?.id) {
        gerenciaAgendamento =
          await this.databaseContextService.gerenciaAgendamentoRepository.find({
            where: {
              localAtendimento: {
                id: data.localAtendimento.id,
              },
            },
            relations: [
              'localAtendimento',
              'localAtendimento.secretariaMunicipal',
            ],
          });
      } else if (data.secretariaMunicipal?.id) {
        gerenciaAgendamento =
          await this.databaseContextService.gerenciaAgendamentoRepository.find({
            where: {
              localAtendimento: {
                secretariaMunicipal: {
                  id: data.secretariaMunicipal.id,
                },
              },
            },
            relations: [
              'localAtendimento',
              'localAtendimento.secretariaMunicipal',
            ],
          });
      }

      const agendamentos = await this.repository.find({
        where: [
          data.localAtendimento?.id
            ? {
              data: data.data,
              horario: data.horario,
              localAtendimento: { id: data.localAtendimento.id },
            }
            : null,
          data.secretariaMunicipal?.id
            ? {
              data: data.data,
              horario: data.horario,
              secretariaMunicipal: { id: data.secretariaMunicipal.id },
            }
            : null,
        ].filter(Boolean),
      });

      if (
        gerenciaAgendamento?.[0] &&
        agendamentos.length >= gerenciaAgendamento[0].numeroAtendimentoIntervalo
      ) {
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }

    return false;
  }

  async findAllBySecretariaMunicipal(): Promise<any> {
    const secretarias = await this.repository.query(`
    select * from secretaria_municipal sm
    where sm.id not in (select secretaria_municipal_id from agendamento);
    `);

    return secretarias;
  }

  async findAll(
    acessoControl: AcessoControl | null,
    query: PaginateQuery,
  ): Promise<Paginated<AgendamentoEntity>> {
    const qb = this.repository.createQueryBuilder('agendamento');

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'agendamento:read',
        qb,
      );
    }

    return paginate(query, qb, {
      ...paginateConfig,
      relations: {
        municipio: true,
        secretariaMunicipal: true,
        localAtendimento: {
          secretariaMunicipal: true,
        },
      },
      searchableColumns: ['data', 'municipio', 'horario'],
      filterableColumns: {
        'secretariaMunicipal.id': [FilterOperator.EQ, FilterOperator.IN],
        'localAtendimento.id': [FilterOperator.EQ, FilterOperator.IN],
        'localAtendimento.secretariaMunicipal.id': [
          FilterOperator.EQ,
          FilterOperator.IN,
        ],
        data: [
          FilterOperator.EQ,
          FilterOperator.GT,
          FilterOperator.GTE,
          FilterOperator.LTE,
          FilterOperator.LT,
        ],
      },
    });
  }

  async create(
    acessoControl: AcessoControl | null,
    data: CreateAgendamentoDto,
  ) {
    if (acessoControl) {
      await acessoControl.ensureCanPerform('agendamento:create', data);
    }
    const agendamentos = await this.repository.find({
      where: {
        cpfCrianca: data.cpfCrianca,
        data: data.data,
      },
    });

    if (agendamentos.length > 0) {
      const formattedDate = format(new Date(data.data), 'dd/MM/yyyy');
      throw new ConflictException(
        `Já existe um agendamento para a criança com o CPF ${data.cpfCrianca} neste mesmo dia ${formattedDate}, se deseja reagendar, por favor, exclua o agendamento existente.`,
      );
    }

    const disponivel = await this.verificarAgendamento(data);

    if (disponivel) {
      throw new BadRequestException(
        `Não é possível agendar entrevistas para o dia ${data.data} no horário ${data.horario}`,
      );
    }

    let localAtendimento = await this.localAtendimentoRepository.findOne({
      where: { id: data.localAtendimento.id },
      relations: [
        'secretariaMunicipal',
      ],
    });
    data.secretariaMunicipal = localAtendimento.secretariaMunicipal;

    const agendamento = this.repository.create({
      ...data,
      status: 'pendente',
    });

    const entity = await this.repository.save(agendamento);

    const comprovante = await this.generateVoucher(entity.id);
    eventBus.emit('mailer:enviarComprovanteAgendamento', comprovante);
    eventBus.emit('whatsapp:enviarComprovanteAgendamento', comprovante);

    return entity;
  }

  async update(
    acessoControl: AcessoControl | null,
    id: string,
    data: UpdateAgendamentoDto,
  ): Promise<AgendamentoEntity> {
    const entity = await this.findOne(null, id);

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'agendamento:update',
        this.repository.createQueryBuilder('agendamento'),
        id,
        data,
      );
    }

    if (entity.status === 'finalizado')
      throw new ConflictException(
        'O agendamento não pode ser modificado porque já foi concluído.',
      );

    const before = structuredClone(entity);

    const agendamento = this.repository.merge(entity, data);

    const after = structuredClone(agendamento);

    await this.repository.save(agendamento);
    if (
      before.horario !== after.horario ||
      format(before.data, 'dd/MM/yyyy') !== format(after.data, 'dd/MM/yyyy')
    ) {
      eventBus.emit(
        'mailer:enviarComprovanteReagendamento',
        await this.generateVoucherChangedAppointment(entity.id, before),
      );
      eventBus.emit(
        'whatsapp:enviarComprovanteReagendamento',
        await this.generateVoucherChangedAppointment(entity.id, before),
      );
    }

    return this.findOne(acessoControl, entity.id);
  }

  async remove(acessoControl: AcessoControl | null, id: string) {
    const entity = await this.findOne(null, id);

    if (acessoControl) {
      await acessoControl.ensureCanReachTarget(
        'agendamento:delete',
        this.repository.createQueryBuilder('agendamento'),
        entity.id,
      );
    }

    eventBus.emit(
      'mailer:enviarComprovanteAgendamentoDesmarcado',
      await this.generateVoucherUnscheduledAppointment(entity.id),
    );
    eventBus.emit(
      'whatsapp:enviarComprovanteAgendamentoDesmarcado',
      await this.generateVoucherUnscheduledAppointment(entity.id),
    );

    return this.repository.remove(entity);
  }

  async geraHorariosGerenciaAgendamento(
    dto: CreateGerenciaAgendamentoDto,
  ): Promise<string[]> {
    let horarios: string[] = [];

    try {
      const { intervaloEntrevista } = dto;

      if (
        // Garantir que é uma string válida
        typeof intervaloEntrevista !== 'string' ||
        // Deve seguir o formato 00:00
        !intervaloEntrevista.match(/^\d{2}:\d{2}$/)
      ) {
        throw new BadRequestException();
      }

      const intervalAsDate = parse(intervaloEntrevista, 'HH:mm', new Date());

      if (!isValid(intervalAsDate)) {
        throw new BadRequestException();
      }

      const intervalMinutes =
        getHours(intervalAsDate) * 60 + getMinutes(intervalAsDate);

      if (dto.horarioInicioMatutino && dto.horarioFimMatutino) {
        horarios = [
          ...horarios,
          ...generateTimes(
            dto.horarioInicioMatutino,
            dto.horarioFimMatutino,
            intervalMinutes,
          ),
        ];
      }

      if (dto.horarioInicioVespertino && dto.horarioFimVespertino) {
        horarios = [
          ...horarios,
          ...generateTimes(
            dto.horarioInicioVespertino,
            dto.horarioFimVespertino,
            intervalMinutes,
          ),
        ];
      }

      return horarios;
    } catch (er) {
      throw new BadRequestException(er.message);
    }
  }

  // Método auxiliar para compatibilidade - encontra LocalAtendimento por SecretariaMunicipal
  async findLocalAtendimentoBySecretariaMunicipal(
    idSecretariaMunicipal: string,
  ) {
    const localAtendimento = await this.localAtendimentoRepository.findOne({
      where: { secretariaMunicipal: { id: idSecretariaMunicipal } },
      relations: ['secretariaMunicipal'],
    });
    return localAtendimento;
  }

  async calendarioAgendamento(
    acessoControl: AcessoControl | null,
    idGerencia: string,
    idLocalAtendimento: string,
  ) {
    const gerenciaAgendamento =
      await this.gerenciaAgendamentoService.internalFindOne(idGerencia);

    const qbAgendamentos = this.repository.createQueryBuilder('agendamento');

    if (acessoControl) {
      await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
        'agendamento:read',
        qbAgendamentos,
      );
    }

    // Join with localAtendimento instead of secretariaMunicipal
    qbAgendamentos.leftJoinAndSelect(
      'agendamento.localAtendimento',
      'localAtendimento',
    );

    // Also load secretariaMunicipal via localAtendimento for compatibility
    qbAgendamentos.leftJoinAndSelect(
      'localAtendimento.secretariaMunicipal',
      'secretariaMunicipalViaLocal',
    );

    // Load the direct secretariaMunicipal for backward compatibility
    qbAgendamentos.leftJoinAndSelect(
      'agendamento.secretariaMunicipal',
      'secretariaMunicipal',
    );

    qbAgendamentos.andWhere('localAtendimento.id = :idLocalAtendimento', {
      idLocalAtendimento,
    });

    const agendamentos = await qbAgendamentos.getMany();

    const horarios =
      await this.horariosAgendamentosService.geraHorariosGerenciaAgendamento(
        gerenciaAgendamento,
      );

    const calendario = agendamentos.map((agendamento) => {
      const datePart = agendamento.data.toISOString().split('T')[0];
      const datePart2 = agendamento.dataNascimento.toISOString().split('T')[0];
      return {
        id: agendamento.id,
        nomeCrianca: agendamento.nomeCrianca,
        data: datePart,
        horario: agendamento.horario,
        nomeRes: agendamento.nomeRes,
        cpfRes: agendamento.cpfRes,
        telefone: agendamento.telefone,
        email: agendamento.email,
        municipio: agendamento.municipio,
        dataNascimento: datePart2,
        cpfCrianca: agendamento.cpfCrianca,
        localAtendimento: agendamento.localAtendimento,
        // Mantém secretariaMunicipal para compatibilidade - pega da relação direta ou via localAtendimento
        secretariaMunicipal:
          agendamento.secretariaMunicipal ||
          agendamento.localAtendimento?.secretariaMunicipal,
      };
    });

    return {
      horarios: horarios,
      agendamentos: calendario,
      intervaloEntrevista: gerenciaAgendamento.numeroAtendimentoIntervalo,
    };
  }

  async calendarioAgendamentoPeriodo(
    acessoControl: AcessoControl | null,
    idGerencia: string,
    idLocalAtendimento: string,
    data: Date,
  ) {
    const dataInicio = new Date(data);

    const dataFim: Date = new Date(
      dataInicio.getTime() + 5 * 24 * 60 * 60 * 1000,
    );

    const qbAgendamentos = this.repository.createQueryBuilder('agendamento');

    if (acessoControl) {
      // await acessoControl.applyConditionFilterToQueryBuilderByStatementAction(
      //   'agendamento:read',
      //   qbAgendamentos,
      // );
    }

    // Join with localAtendimento instead of secretariaMunicipal
    qbAgendamentos.leftJoinAndSelect(
      'agendamento.localAtendimento',
      'localAtendimento',
    );

    // Also load secretariaMunicipal via localAtendimento for compatibility
    qbAgendamentos.leftJoinAndSelect(
      'localAtendimento.secretariaMunicipal',
      'secretariaMunicipalViaLocal',
    );

    // Load the direct secretariaMunicipal for backward compatibility
    qbAgendamentos.leftJoinAndSelect(
      'agendamento.secretariaMunicipal',
      'secretariaMunicipal',
    );

    qbAgendamentos.leftJoinAndSelect('agendamento.municipio', 'municipio');

    qbAgendamentos.andWhere(
      'agendamento.data BETWEEN :dataInicio AND :dataFim',
      {
        dataInicio,
        dataFim,
      },
    );

    qbAgendamentos.andWhere('localAtendimento.id = :idLocalAtendimento', {
      idLocalAtendimento,
    });

    let agendamentos = await qbAgendamentos.getMany();

    // Atualiza status dos agendamentos com base em algumas verificações
    agendamentos = await this.updateStatusAgendamento(agendamentos);

    const gerenciaAgendamento =
      await this.gerenciaAgendamentoService.internalFindOne(idGerencia);

    const horarios =
      await this.horariosAgendamentosService.geraHorariosGerenciaAgendamento(
        gerenciaAgendamento,
      );

    const calendario = agendamentos.map((agendamento) => {
      const datePart = agendamento.data.toISOString().split('T')[0];
      const datePart2 = agendamento.dataNascimento.toISOString().split('T')[0];
      return {
        id: agendamento.id,
        nomeCrianca: agendamento.nomeCrianca,
        data: datePart,
        horario: agendamento.horario,
        nomeRes: agendamento.nomeRes,
        cpfRes: agendamento.cpfRes,
        telefone: agendamento.telefone,
        email: agendamento.email,
        municipio: agendamento.municipio,
        dataNascimento: datePart2,
        cpfCrianca: agendamento.cpfCrianca,
        status: agendamento.status,
        localAtendimento: agendamento.localAtendimento,
        // Mantém secretariaMunicipal para compatibilidade - pega da relação direta ou via localAtendimento
        secretariaMunicipal:
          agendamento.secretariaMunicipal ||
          agendamento.localAtendimento?.secretariaMunicipal,
      };
    });

    return {
      horarios: horarios,
      agendamentos: calendario,
      intervaloEntrevista: gerenciaAgendamento.numeroAtendimentoIntervalo,
    };
  }

  private async updateStatusAgendamento(
    agendamentos: AgendamentoEntity[],
  ): Promise<AgendamentoEntity[]> {
    const updatedAgendamento = await Promise.all(
      agendamentos.map(async (agendamento) => {
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().split('T')[0];
        const currentTimeString = currentDate
          .toTimeString()
          .split(' ')[0]
          .substring(0, 5);

        const agendamentoData = agendamento.data.toISOString().split('T')[0];

        const entrevista =
          await this.entrevistaService.internalFindOneByCriancaCpf(
            agendamento.cpfCrianca,
          );

        if (!entrevista) {
          if (
            agendamento.status === 'pendente' &&
            agendamentoData < currentDateString &&
            agendamento.horario < currentTimeString
          ) {
            agendamento.status = 'suspenso';
            await this.repository.save(agendamento);
          }
        }

        return agendamento;
      }),
    );

    return updatedAgendamento;
  }

  async removeDuplicates(acessoControl: AcessoControl | null): Promise<any> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const allAgendamentos = await this.repository.find({
      where: {
        data: MoreThanOrEqual(yesterday),
      },
      order: { data: 'ASC', horario: 'ASC' },
      relations: ['secretariaMunicipal', 'municipio'],
    });

    const seen = new Map<string, AgendamentoEntity>();
    const duplicatesMap = new Map<string, AgendamentoEntity[]>();

    for (const agendamento of allAgendamentos) {
      const key = `${agendamento.cpfCrianca
        }-${agendamento.data.toISOString()}-${agendamento.horario}`;

      if (seen.has(key)) {
        if (!duplicatesMap.has(agendamento.cpfCrianca)) {
          duplicatesMap.set(agendamento.cpfCrianca, []);
        }
        duplicatesMap.get(agendamento.cpfCrianca).push(agendamento);
      } else {
        seen.set(key, agendamento);
      }
    }

    const result = [];

    for (const [cpf, duplicates] of duplicatesMap.entries()) {
      const personInfo = {
        cpfCrianca: cpf,
        nomeCrianca: duplicates[0].nomeCrianca,
        nomeResponsavel: duplicates[0].nomeRes,
        quantidadeExcluida: duplicates.length,
        agendamentosExcluidos: duplicates.map((d) => ({
          id: d.id,
          data: d.data,
          horario: d.horario,
          secretariaMunicipal: d.secretariaMunicipal?.nomeFantasia,
          municipio: d.municipio?.nome,
        })),
      };

      result.push(personInfo);

      for (const duplicate of duplicates) {
        await this.repository.remove(duplicate);
      }
    }

    return {
      totalPessoas: result.length,
      totalAgendamentosExcluidos: result.reduce(
        (acc, curr) => acc + curr.quantidadeExcluida,
        0,
      ),
      detalhamento: result,
    };
  }
}
