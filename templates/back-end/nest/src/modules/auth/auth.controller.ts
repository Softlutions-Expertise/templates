import { Body, Controller, Get, Inject, Param, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { Public } from '../../infrastructure';
import { AcessoControl } from '../../infrastructure/acesso-control';
import { ResolveAcessoControl } from '../../infrastructure/acesso-control/decorators';
import { AuthService } from './auth.service';
import { UsuarioEntity } from '../../modules/pessoa/entities/usuario.entity';
import { ColaboradorEntity } from '../../modules/pessoa/entities/colaborador.entity';
import { JwtService } from '@nestjs/jwt';

const tryParseJson = (str: string) => {
  try {
    const parsed = JSON.parse(str);
    return parsed;
  } catch (error) {}
  return str;
};

@ApiTags('Autenticação')
@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    @Inject('USUARIO_REPOSITORY')
    private usuarioRepository: Repository<UsuarioEntity>,
    @Inject('COLABORADOR_REPOSITORY')
    private colaboradorRepository: Repository<ColaboradorEntity>,
  ) {}

  @Public()
  @ApiBearerAuth()
  @Get('/whoami')
  async getWhoAmI(@ResolveAcessoControl() acessoControl: AcessoControl) {
    return this.authService.getWhoAmI(acessoControl);
  }

  @Public()
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  @ApiParam({
    name: 'action',
    description: 'Ação a ser executada',
    required: true,
  })
  @Post('/check-can-perform/:action')
  async checkCanPerform(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('action') action: string,
    @Body() payload: any,
  ) {
    return this.authService.checkCanPerform(acessoControl, action, payload);
  }

  @Public()
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  @ApiParam({
    name: 'targetIdJson',
    description: 'ID do registro alvo',
    required: true,
  })
  @ApiParam({
    name: 'action',
    description: 'Ação a ser executada no alvo',
    required: true,
  })
  @Post('/check-can-reach/:targetIdJson/:action')
  async checkCanReachTarget(
    @ResolveAcessoControl() acessoControl: AcessoControl,
    @Param('action') action: any,
    @Param('targetIdJson') targetIdJson: string,
    @Body() payload: any,
  ) {
    const targetId = tryParseJson(targetIdJson);

    return this.authService.checkCanReachTarget(
      acessoControl,
      action,
      targetId,
      payload,
    );
  }

  @Public()
  @Post('/login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;

    // Buscar usuário pelo username
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario: username },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    // Verificar senha (SHA256)
    const hashedPassword = require('crypto')
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (usuario.senha !== hashedPassword) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    // Buscar colaborador para pegar o CPF
    const colaborador = await this.colaboradorRepository.findOne({
      where: { usuario: { id: usuario.id } },
      relations: ['pessoa', 'usuario'],
    });

    if (!colaborador) {
      throw new UnauthorizedException('Colaborador não encontrado');
    }

    // Gerar JWT
    const payload = {
      sub: usuario.id,
      username: usuario.usuario,
      nivelAcesso: usuario.nivelAcesso,
      cpf: colaborador.pessoa.cpf,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: usuario.id,
        username: usuario.usuario,
        nivelAcesso: usuario.nivelAcesso,
        nome: colaborador.pessoa.nome,
      },
    };
  }

  @Public()
  @Get('/me')
  async getMe(@ResolveAcessoControl() acessoControl: AcessoControl) {
    if (!acessoControl?.currentColaborador) {
      throw new UnauthorizedException('Não autenticado');
    }

    const colaborador = await this.colaboradorRepository.findOne({
      where: { id: acessoControl.currentColaborador.id },
      relations: ['pessoa', 'usuario'],
    });

    if (!colaborador) {
      throw new UnauthorizedException('Colaborador não encontrado');
    }

    return {
      id: colaborador.id,
      nome: colaborador.pessoa.nome,
      cpf: colaborador.pessoa.cpf,
      username: colaborador.usuario.usuario,
      nivelAcesso: colaborador.usuario.nivelAcesso,
    };
  }
}
