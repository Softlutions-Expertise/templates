import { Injectable } from '@nestjs/common';
import { ICurrentFuncionario } from '../authentication';
import { AuthorizationService } from '../authorization';
import { DatabaseContextService } from '../database-context/database-context.service';
import { AcessoControl } from './core/acesso-control';

@Injectable()
export class AcessoControlService {
  constructor(
    private databaseContextService: DatabaseContextService,
    private authorizationService: AuthorizationService,
  ) {}

  //

  async createAcessoControl(currentFuncionario: ICurrentFuncionario) {
    const authzPolicy = await this.authorizationService.getAuthzPolicy(
      currentFuncionario,
    );

    return new AcessoControl(
      currentFuncionario,
      authzPolicy,
      this.databaseContextService,
    );
  }
}
