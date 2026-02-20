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
import { TipoVinculoInstituicao } from '../../modules/pessoa/entities/enums/pessoa.enum';
import { FuncionarioEntity } from '../../modules/pessoa/entities/funcionario.entity';
import { ICurrentFuncionario } from './decorators';
import { IdpConnectGovBrService } from './idp-connect-govbr/idp-connect-govbr.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private idpConnectService: IdpConnectGovBrService,

    private integrationAccessTokenService: IntegrationAccessTokenService,

    @Inject('FUNCIONARIO_REPOSITORY')
    private funcionarioRepository: Repository<FuncionarioEntity>,
  ) {
    //
  }

  getOpenIdConfiguration() {
    return this.idpConnectService.getOpenIdConfiguration();
  }

  private async getCurrentFuncionarioByCpf(
    cpf: string,
  ): Promise<ICurrentFuncionario> {
    const funcionario = await this.funcionarioRepository
      .createQueryBuilder('funcionario')
      .innerJoin('funcionario.pessoa', 'pessoa')
      .innerJoin('funcionario.usuario', 'usuario')
      .select([
        'funcionario.id',
        'funcionario.cargo',
        'funcionario.tipoVinculo',
        'pessoa',
        'usuario.id',
        'usuario.nivelAcesso',
        'usuario.situacaoCadastral',
      ])
      .leftJoinAndSelect(
        'funcionario.unidadesEscolares',
        'escola',
        'funcionario.tipoVinculo = :tipoVinculoEscola',
        { tipoVinculoEscola: TipoVinculoInstituicao.UnidadeEscolar },
      )
      .leftJoinAndSelect('escola.secretariaMunicipal', 'escolaSecretarias')
      .leftJoinAndSelect('escola.endereco', 'escolaEndereco')
      .leftJoinAndSelect(
        'funcionario.secretarias',
        'secretaria',
        'funcionario.tipoVinculo = :tipoVinculoSecretaria',
        { tipoVinculoSecretaria: TipoVinculoInstituicao.SecretariaMunicipal },
      )
      .leftJoinAndSelect('secretaria.endereco', 'secretariaEndereco')
      .where('pessoa.cpf = :cpf', { cpf })
      .getOne();

    if (funcionario) {
      return {
        id: funcionario.id,

        cargo: funcionario.cargo,

        tipoVinculo: funcionario.tipoVinculo,

        pessoa: funcionario.pessoa,

        unidadesEscolares: funcionario.unidadesEscolares,
        secretarias: funcionario.secretarias,

        usuario: {
          id: funcionario.usuario.id,
          nivelAcesso: funcionario.usuario.nivelAcesso,
          situacaoCadastral: funcionario.usuario.situacaoCadastral,
        },
      };
    }

    throw new ForbiddenException(
      'O funcionário não possui perfil no sistema da fila de espera.',
    );
  }

  async getCurrentFuncionarioByAccessToken(
    accessToken?: string,
  ): Promise<ICurrentFuncionario> {
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
            'Unsupported Integration Access Token: herdaPermissoesDeFuncionario is required.',
          );
        }

        const cpf =
          integrationAccessToken.herdaPermissoesDeFuncionario.pessoa.cpf;

        return this.getCurrentFuncionarioByCpf(cpf);
      } else if (process.env.ENABLE_MOCK_ACCESS_TOKEN === 'true') {
        const cpfMockMatch = accessToken.match(/^mock\.cpf\.(\d{11})$/);

        if (cpfMockMatch) {
          const cpf = cpfMockMatch[1];
          return this.getCurrentFuncionarioByCpf(cpf);
        }
      }

      const { cpf } = await this.idpConnectService.loginWithAccessToken(
        accessToken,
      );

      return this.getCurrentFuncionarioByCpf(cpf);
    }

    return null;
  }
}
