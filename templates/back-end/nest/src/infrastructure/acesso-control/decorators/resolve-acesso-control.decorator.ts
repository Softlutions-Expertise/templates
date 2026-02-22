import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface ICurrentAcessoControl {
  currentColaborador: any;
}

export const ResolveAcessoControl = createParamDecorator(
  (_: unknown, context: ExecutionContext): ICurrentAcessoControl => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const user = (<any>request).user;
    return {
      currentColaborador: user,
    };
  },
);
