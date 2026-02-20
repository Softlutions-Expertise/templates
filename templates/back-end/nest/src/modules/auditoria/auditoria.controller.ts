import { Controller, Get, Query, UseGuards, Req, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuditoriaService } from './auditoria.service';
import { FiltroAuditoriaDto } from './dto/filtro-auditoria.dto';
import { JwtAuthGuard } from '../../infrastructure/authorization/guards/jwt-auth.guard';

@ApiTags('Auditoria')
@Controller('auditoria')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as auditorias' })
  async listar(@Query() filtros: FiltroAuditoriaDto) {
    return this.auditoriaService.listar(filtros);
  }

  @Get('minhas')
  @ApiOperation({ summary: 'Listar auditorias do usuário logado' })
  async listarMinhas(
    @Req() req: Request & { user: { userId: string } },
    @Query() filtros: Omit<FiltroAuditoriaDto, 'usuarioId'>,
  ) {
    return this.auditoriaService.listarPorUsuario(req.user.userId, filtros);
  }

  @Get('sessoes/:usuarioId')
  @ApiOperation({ summary: 'Listar sessões (JWTs) de um usuário' })
  async listarSessoes(
    @Param('usuarioId') usuarioId: string,
  ) {
    const sessoes = await this.auditoriaService.listarSessoes(usuarioId);
    return {
      data: sessoes.map(s => ({
        ...s,
        dataInicio: s.dataInicio.toISOString(),
        dataFim: s.dataFim.toISOString(),
      })),
    };
  }
}
