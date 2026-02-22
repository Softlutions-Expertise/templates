import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ColaboradorEntity } from '../../modules/pessoa/entities/colaborador.entity';
import { ICurrentColaborador } from './decorators';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    @Inject('COLABORADOR_REPOSITORY')
    private colaboradorRepository: Repository<ColaboradorEntity>,
  ) {}

  private async getCurrentColaboradorByCpf(
    cpf: string,
  ): Promise<ICurrentColaborador> {
    const colaborador = await this.colaboradorRepository
      .createQueryBuilder('colaborador')
      .innerJoin('colaborador.pessoa', 'pessoa')
      .innerJoin('colaborador.usuario', 'usuario')
      .select([
        'colaborador.id',
        'colaborador.cargo',
        'colaborador.tipoVinculo',
        'colaborador.instituicaoId',
        'colaborador.instituicaoNome',
        'pessoa',
        'usuario.id',
        'usuario.nivelAcesso',
        'usuario.situacaoCadastral',
      ])
      .where('pessoa.cpf = :cpf', { cpf })
      .getOne();

    if (colaborador) {
      return {
        id: colaborador.id,
        cargo: colaborador.cargo,
        tipoVinculo: colaborador.tipoVinculo,
        instituicaoId: colaborador.instituicaoId,
        instituicaoNome: colaborador.instituicaoNome,
        pessoa: colaborador.pessoa,
        usuario: {
          id: colaborador.usuario.id,
          nivelAcesso: colaborador.usuario.nivelAcesso,
          situacaoCadastral: colaborador.usuario.situacaoCadastral,
        },
      };
    }

    throw new ForbiddenException(
      'O colaborador não possui perfil no sistema.',
    );
  }

  async getCurrentColaboradorByAccessToken(
    accessToken?: string,
  ): Promise<ICurrentColaborador> {
    if (!accessToken) {
      return null;
    }

    try {
      // Verificar JWT
      const payload = this.jwtService.verify(accessToken);
      
      if (payload.cpf) {
        return this.getCurrentColaboradorByCpf(payload.cpf);
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * @deprecated Use getCurrentColaboradorByAccessToken instead
   */
  async getCurrentFuncionarioByAccessToken(
    accessToken?: string,
  ): Promise<ICurrentColaborador> {
    return this.getCurrentColaboradorByAccessToken(accessToken);
  }
}
