import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { EscolaEntity } from '../../../modules/escola/entities/escola.entity';
import { FuncionarioEntity } from '../../../modules/pessoa/entities/funcionario.entity';
import { PessoaEntity } from '../../../modules/pessoa/entities/pessoa.entity';
import { SecretariaMunicipalEntity } from '../../../modules/secretaria-municipal/entities/secretaria-municipal.entity';

export type ICurrentFuncionario =
  | null
  | (Pick<
      FuncionarioEntity,
      'id' | 'cargo' | 'tipoVinculo' 
    > & {
      usuario: Pick<
        FuncionarioEntity['usuario'],
        'id' | 'nivelAcesso' | 'situacaoCadastral'
      >;

      pessoa: PessoaEntity;

     secretarias?: SecretariaMunicipalEntity[] | null;
     unidadesEscolares?: EscolaEntity[] | null;
    });

export const CurrentFuncionario = createParamDecorator(
  (_: unknown, context: ExecutionContext): ICurrentFuncionario => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    return (<any>request).user || null;
  },
);
