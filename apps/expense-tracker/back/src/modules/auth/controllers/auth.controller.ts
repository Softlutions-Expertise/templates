import { Controller, Post, Get, Body, UseGuards, Request, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dto';
import { JwtAuthGuard } from '@/infrastructure/authentication/jwt-auth.guard';
import { AuditoriaService } from '@/modules/auditoria/auditoria.service';
import { TipoAcao } from '@/modules/auditoria/entities/auditoria.entity';

// ----------------------------------------------------------------------

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() dto: LoginDto, @Req() req: ExpressRequest) {
    const result = await this.authService.login(dto);

    // Registra auditoria de login
    if (result.user) {
      await this.auditoriaService.registrar(TipoAcao.LOGIN, 'auth', {
        usuarioId: result.user.id,
        usuarioEmail: result.user.email,
        descricao: `Usuário ${result.user.email} realizou login`,
        ipAddress: this.getClientIp(req),
        userAgent: req.headers['user-agent'],
      });
    }

    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all users for audit filter' })
  async listUsers() {
    return this.authService.listUsers();
  }

  private getClientIp(request: ExpressRequest): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return request.ip || request.socket?.remoteAddress || '';
  }
}
