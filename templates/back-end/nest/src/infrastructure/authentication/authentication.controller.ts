import { Controller, Post, Body, Get, UseGuards, UnauthorizedException, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticationService, ICurrentUser } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { AuditoriaService } from '../../modules/auditoria/auditoria.service';
import { TipoAcao } from '../../modules/auditoria/entities/auditoria.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private authService: AuthenticationService,
    private auditoriaService: AuditoriaService,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const result = await this.authService.login(user);

    // Registra auditoria de login
    await this.auditoriaService.registrar(TipoAcao.LOGIN, 'auth', {
      usuarioId: user.id,
      usuarioEmail: user.email,
      descricao: `Usuário ${user.email} realizou login`,
      ipAddress: this.getClientIp(req),
      userAgent: req.headers['user-agent'],
    });

    return result;
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(
      registerDto.name,
      registerDto.email,
      registerDto.password,
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  async getMe(@CurrentUser() user: ICurrentUser) {
    return user;
  }

  private getClientIp(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return request.ip || request.socket.remoteAddress || '';
  }
}
