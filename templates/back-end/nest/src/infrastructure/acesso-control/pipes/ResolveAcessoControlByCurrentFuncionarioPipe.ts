import { Injectable, PipeTransform } from '@nestjs/common';
import { ICurrentFuncionario } from '../../authentication';
import { AcessoControlService } from '../acesso-control.service';

@Injectable()
export class ResolveAcessoControlByCurrentFuncionarioPipe
  implements PipeTransform
{
  constructor(private acessoControlService: AcessoControlService) {}

  async transform(
    currentFuncionario: ICurrentFuncionario /* _metadata: ArgumentMetadata */,
  ) {
    const acessoControl = await this.acessoControlService.createAcessoControl(
      currentFuncionario,
    );

    return acessoControl;
  }
}
