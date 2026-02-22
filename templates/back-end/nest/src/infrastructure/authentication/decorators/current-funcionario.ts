import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ColaboradorEntity } from '../../../modules/pessoa/entities/colaborador.entity';
import { PessoaEntity } from '../../../modules/pessoa/entities/pessoa.entity';

export type ICurrentColaborador =
  | null
  | (Pick<
      ColaboradorEntity,
      'id' | 'cargo' | 'tipoVinculo' | 'instituicaoId' | 'instituicaoNome'
    > & {
      usuario: Pick<
        ColaboradorEntity['usuario'],
        'id' | 'nivelAcesso' | 'situacaoCadastral'
      >;
      pessoa: PessoaEntity;
    });

/**
 * @deprecated Use CurrentColaborador instead
 */
export type ICurrentFuncionario = ICurrentColaborador;

export const CurrentColaborador = createParamDecorator(
  (_: unknown, context: ExecutionContext): ICurrentColaborador => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    return (<any>request).user || null;
  },
);

/**
 * @deprecated Use CurrentColaborador instead
 */
export const CurrentFuncionario = CurrentColaborador;
