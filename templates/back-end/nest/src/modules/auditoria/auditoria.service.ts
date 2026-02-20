import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Auditoria, TipoAcao } from './entities/auditoria.entity';
import { CriarAuditoriaDto } from './dto/criar-auditoria.dto';
import { FiltroAuditoriaDto } from './dto/filtro-auditoria.dto';
import { SessaoVO } from './vo/sessao.vo';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
  ) {}

  async criar(dto: CriarAuditoriaDto): Promise<Auditoria> {
    const auditoria = this.auditoriaRepository.create(dto);
    return this.auditoriaRepository.save(auditoria);
  }

  async listar(filtros: FiltroAuditoriaDto): Promise<{ data: Auditoria[]; total: number; page: number; limit: number }> {
    const { usuarioId, acao, dataInicio, dataFim, page = 1, limit = 20 } = filtros;

    const where: any = {};

    if (usuarioId) {
      where.usuarioId = usuarioId;
    }

    if (acao) {
      where.acao = acao;
    }

    if (dataInicio && dataFim) {
      where.createdAt = Between(new Date(dataInicio), new Date(dataFim));
    }

    const [data, total] = await this.auditoriaRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async listarPorUsuario(usuarioId: string, filtros: Omit<FiltroAuditoriaDto, 'usuarioId'>): Promise<{ data: Auditoria[]; total: number; page: number; limit: number }> {
    return this.listar({ ...filtros, usuarioId });
  }

  async obterPorId(id: string): Promise<Auditoria | null> {
    return this.auditoriaRepository.findOne({ where: { id } });
  }

  /**
   * Método helper para registrar ações de forma simplificada
   */
  async registrar(
    acao: TipoAcao,
    entidade: string,
    dados: {
      usuarioId?: string;
      usuarioEmail?: string;
      entidadeId?: string;
      dadosAnteriores?: Record<string, any>;
      dadosNovos?: Record<string, any>;
      descricao?: string;
      ipAddress?: string;
      userAgent?: string;
      jwtToken?: string;
    },
  ): Promise<Auditoria> {
    return this.criar({
      acao,
      entidade,
      ...dados,
    });
  }

  /**
   * Lista as sessões (JWTs únicos) de um usuário
   * Retorna as sessões numeradas do mais recente (1) para o mais antigo
   */
  async listarSessoes(usuarioId: string): Promise<SessaoVO[]> {
    // Busca todos os registros do usuário agrupados por jwtToken
    const registros = await this.auditoriaRepository
      .createQueryBuilder('a')
      .select([
        'a.jwtToken as jwt',
        'MIN(a.createdAt) as data_inicio',
        'MAX(a.createdAt) as data_fim',
        'COUNT(*) as total',
        'MAX(a.ipAddress) as ip',
        'MAX(a.userAgent) as ua',
      ])
      .where('a.usuarioId = :usuarioId', { usuarioId })
      .andWhere('a.jwtToken IS NOT NULL')
      .groupBy('a.jwtToken')
      .orderBy('data_inicio', 'DESC')
      .getRawMany();

    // Mapeia para o formato de sessão, numerando do mais recente (1)
    const sessoes: SessaoVO[] = registros.map((r, index) => ({
      id: r.jwt,
      numero: index + 1, // 1 = mais recente
      dataInicio: new Date(r.data_inicio),
      dataFim: new Date(r.data_fim),
      totalAcoes: parseInt(r.total, 10),
      ipAddress: r.ip,
      userAgent: r.ua,
    }));

    return sessoes;
  }
}
