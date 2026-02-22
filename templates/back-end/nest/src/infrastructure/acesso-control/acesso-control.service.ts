import { Injectable } from '@nestjs/common';
import { ICurrentColaborador } from '../authentication';
import { AuthorizationService } from '../authorization';
import { DatabaseContextService } from '../database-context/database-context.service';
import { AcessoControl } from './core/acesso-control';

@Injectable()
export class AcessoControlService {
  constructor(
    private databaseContextService: DatabaseContextService,
    private authorizationService: AuthorizationService,
  ) {}

  async createAcessoControl(currentColaborador: ICurrentColaborador) {
    const authzPolicy = await this.authorizationService.getAuthzPolicy(
      currentColaborador,
    );

    return new AcessoControl(
      currentColaborador,
      authzPolicy,
      this.databaseContextService,
    );
  }

  /**
   * @deprecated Use createAcessoControl instead
   */
  async createAcessoControlByFuncionario(currentFuncionario: ICurrentColaborador) {
    return this.createAcessoControl(currentFuncionario);
  }
}
