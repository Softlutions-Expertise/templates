import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AuditoriaService } from '@/apps/auditoria/auditoria.service';
import { TipoAcao } from '@/apps/auditoria/entities/auditoria.entity';
import { AUDITABLE_KEY, AuditableOptions } from '@/apps/auditoria/decorators/auditable.decorator';
import { calcularDiff, sanitizarDados, mascararSensiveis } from '@/apps/auditoria/utils/diff.util';

interface RequestWithUser extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

/**
 * Interceptor de Auditoria Automática
 * 
 * Captura CREATE, UPDATE, DELETE e registra:
 * - CREATE: dados criados
 * - UPDATE: diff (before/after)
 * - DELETE: snapshot do deletado
 * 
 * Uso:
 * 1. Aplique no controller: @UseInterceptors(AuditoriaInterceptor)
 * 2. Use @Auditable({ entidade: 'Nome' }) no controller ou método
 * 3. Para UPDATE funcional, o service deve retornar o objeto completo
 */
@Injectable()
export class AuditoriaInterceptor implements NestInterceptor {
  constructor(
    private readonly auditoriaService: AuditoriaService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { method, url, body, user, params } = request;

    // Pega configuração do decorator @Auditable
    const options = this.getAuditableOptions(context);
    
    // Se não tiver @Auditable ou estiver marcado para ignorar, passa direto
    if (!options || options.ignorar) {
      return next.handle();
    }

    // Determina a ação baseado no método HTTP
    const acao = this.determinarAcao(method);
    if (!acao) {
      return next.handle(); // GET não é auditado aqui
    }

    const entidade = options.entidade;
    const entidadeId = params?.id || body?.id || null;

    // Para UPDATE, tenta buscar dados antes da alteração
    let dadosAntes: Record<string, any> | null = null;
    if (acao === TipoAcao.UPDATE && entidadeId) {
      // O service deve implementar um método findOne para buscar antes
      // Ou o controller pode passar via @Body() o objeto completo
      dadosAntes = body?._original || null;
    }

    return next.handle().pipe(
      tap(async (response) => {
        try {
          await this.registrarAuditoria({
            acao,
            entidade,
            entidadeId: response?.id || entidadeId,
            dadosAntes,
            dadosDepois: response,
            body,
            user,
            request,
            options,
          });
        } catch (error) {
          // Silencia erro de auditoria para não quebrar a requisição
          console.error('[Auditoria] Erro ao registrar:', error.message);
        }
      }),
    );
  }

  private getAuditableOptions(context: ExecutionContext): AuditableOptions | undefined {
    // Primeiro tenta pegar do método
    const methodOptions = this.reflector.getAllAndOverride<AuditableOptions>(
      AUDITABLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    
    if (methodOptions) return methodOptions;

    // Se não tiver no método, pega da classe (controller)
    return this.reflector.get<AuditableOptions>(AUDITABLE_KEY, context.getClass());
  }

  private determinarAcao(method: string): TipoAcao | null {
    switch (method) {
      case 'POST':
        return TipoAcao.CREATE;
      case 'PUT':
      case 'PATCH':
        return TipoAcao.UPDATE;
      case 'DELETE':
        return TipoAcao.DELETE;
      default:
        return null;
    }
  }

  private async registrarAuditoria(params: {
    acao: TipoAcao;
    entidade: string;
    entidadeId: string | null;
    dadosAntes: Record<string, any> | null;
    dadosDepois: any;
    body: any;
    user: RequestWithUser['user'];
    request: RequestWithUser;
    options: AuditableOptions;
  }): Promise<void> {
    const { acao, entidade, entidadeId, dadosAntes, dadosDepois, user, request, options } = params;

    // Sanitiza dados
    const dadosNovosSanitizados = dadosDepois ? sanitizarDados(dadosDepois) : null;
    const dadosAntesSanitizados = dadosAntes ? sanitizarDados(dadosAntes) : null;

    // Mascara campos sensíveis
    const camposSensiveis = options.camposSensiveis || [];

    // Prepara payload base
    let dadosAuditoria: {
      created?: Record<string, any>;
      changedFields?: string[];
      changes?: Array<{ field: string; from: any; to: any }>;
      deletedSnapshot?: Record<string, any>;
    } = {};

    let descricao = '';

    switch (acao) {
      case TipoAcao.CREATE:
        dadosAuditoria = {
          created: mascararSensiveis(dadosNovosSanitizados || {}, camposSensiveis),
        };
        descricao = `Criou ${entidade} #${dadosNovosSanitizados?.id || entidadeId || 'novo'}`;
        break;

      case TipoAcao.UPDATE:
        // Se não tiver dados antes, registra só o after
        if (dadosAntesSanitizados && dadosNovosSanitizados) {
          const diff = calcularDiff(dadosAntesSanitizados, dadosNovosSanitizados);
          
          // Se não mudou nada, não registra
          if (!diff.hasChanges) {
            console.log('[Auditoria] UPDATE sem alterações, ignorando');
            return;
          }

          dadosAuditoria = {
            changedFields: diff.changedFields,
            changes: diff.changes.map(c => ({
              field: c.field,
              from: camposSensiveis.includes(c.field) ? '***' : c.from,
              to: camposSensiveis.includes(c.field) ? '***' : c.to,
            })),
          };
          descricao = `Atualizou ${entidade} #${entidadeId} - Campos: ${diff.changedFields.join(', ')}`;
        } else {
          // Fallback: registra só o novo estado
          dadosAuditoria = {
            changedFields: Object.keys(dadosNovosSanitizados || {}),
            changes: Object.entries(dadosNovosSanitizados || {}).map(([field, to]) => ({
              field,
              from: null,
              to: camposSensiveis.includes(field) ? '***' : to,
            })),
          };
          descricao = `Atualizou ${entidade} #${entidadeId}`;
        }
        break;

      case TipoAcao.DELETE:
        dadosAuditoria = {
          deletedSnapshot: dadosAntesSanitizados || { id: entidadeId },
        };
        descricao = `Deletou ${entidade} #${entidadeId}`;
        break;
    }

    // Monta dados finais
    const dadosFinais = {
      ...dadosAuditoria,
      // Adiciona metadados úteis
      _meta: {
        httpMethod: request.method,
        url: request.url,
      },
    };

    // Captura o JWT do header Authorization
    const authHeader = request.headers['authorization'];
    const jwtToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    await this.auditoriaService.registrar(acao, entidade, {
      usuarioId: user?.userId,
      usuarioEmail: user?.email,
      entidadeId,
      dadosAnteriores: acao === TipoAcao.UPDATE ? dadosAntesSanitizados : null,
      dadosNovos: acao === TipoAcao.CREATE || acao === TipoAcao.UPDATE 
        ? dadosFinais 
        : null,
      descricao,
      ipAddress: this.getClientIp(request),
      userAgent: request.headers['user-agent'],
      jwtToken,
    });

    console.log(`[Auditoria] ${acao.toUpperCase()} ${entidade} #${entidadeId} registrado`);
  }

  private getClientIp(request: RequestWithUser): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return request.ip || request.socket?.remoteAddress || '';
  }
}
