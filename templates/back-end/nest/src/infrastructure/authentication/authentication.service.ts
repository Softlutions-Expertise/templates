import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  IntegrationAccessTokenService,
  isCDVAccessTokenV1,
} from '../../modules/integrations/integration-access-token/integration-access-token.service';
import { ColaboradorEntity } from '../../modules/pessoa/entities/colaborador.entity';
import { ICurrentColaborador } from './decorators';
import { IdpConnectGovBrService } from './idp-connect-govbr/idp-connect-govbr.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private idpConnectService: IdpConnectGovBrService,
    private integrationAccessTokenService: IntegrationAccessTokenService,
    @Inject('COLABORADOR_REPOSITORY')
    private colaboradorRepository: Repository<ColaboradorEntity>,
  ) {}

  getOpenIdConfiguration() {
    return this.idpConnectService.getOpenIdConfiguration();
  }

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
    if (typeof accessToken === 'string') {
      if (isCDVAccessTokenV1(accessToken)) {
        const integrationAccessToken =
          await this.integrationAccessTokenService.findOneByToken(
            null,
            accessToken,
          );

        if (!integrationAccessToken) {
          throw new UnauthorizedException(
            'Integration Access Token do not exists.',
          );
        }

        if (!integrationAccessToken.ativo) {
          throw new UnauthorizedException('Inactive Integration Access Token.');
        }

        if (
          integrationAccessToken.validoAte &&
          new Date() > integrationAccessToken.validoAte
        ) {
          throw new UnauthorizedException('Expired Integration Access Token.');
        }

        if (!integrationAccessToken.herdaPermissoesDeFuncionario) {
          throw new UnauthorizedException(
            'Unsupported Integration Access Token: herdaPermissoesDeColaborador is required.',
          );
        }

        const cpf =
          integrationAccessToken.herdaPermissoesDeFuncionario.pessoa.cpf;

        return this.getCurrentColaboradorByCpf(cpf);
      } else if (process.env.ENABLE_MOCK_ACCESS_TOKEN === 'true') {
        const cpfMockMatch = accessToken.match(/^mock\.cpf\.(\d{11})$/);

        if (cpfMockMatch) {
          const cpf = cpfMockMatch[1];
          return this.getCurrentColaboradorByCpf(cpf);
        }
      }

      const { cpf } = await this.idpConnectService.loginWithAccessToken(
        accessToken,
      );

      return this.getCurrentColaboradorByCpf(cpf);
    }

    return null;
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
