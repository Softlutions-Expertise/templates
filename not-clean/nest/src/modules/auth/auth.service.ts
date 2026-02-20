import { BadRequestException, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AcessoControl } from '../../infrastructure/acesso-control/core/acesso-control';

@Injectable()
export class AuthService {
  constructor(private moduleRef: ModuleRef) {}

  async getWhoAmI(acessoControl: AcessoControl) {
    return acessoControl.getWhoAmI();
  }

  async checkCanPerform(
    acessoControl: AcessoControl,
    action: string,
    checkPayload?: any,
  ) {
    let can = false;

    const statement = acessoControl.getStatementForAction(<any>action);

    if (statement) {
      if (statement.kind === 'check') {
        const getDtoClass = statement.getDtoClass;

        if (getDtoClass) {
          if (checkPayload) {
            const validatorClass = getDtoClass();

            try {
              const dto = plainToInstance(validatorClass, checkPayload, {});

              const errors = await validate(validatorClass);

              if (errors.length === 0) {
                can = await acessoControl.checkCanPerform(
                  statement.action,
                  dto,
                );
              }
            } catch (error) {}
          }
        } else {
          can = await acessoControl.checkCanPerform(statement.action);
        }
      } else {
        throw new BadRequestException(
          "A funcionalidade 'checkCanPerform' só pode ser usado para statements do tipo 'check'.",
        );
      }
    }

    return {
      can,
    };
  }

  async checkCanReachTarget(
    acessoControl: AcessoControl,
    action: string,
    targetId: any,
    checkPayload?: any,
  ) {
    let can = false;

    const statement = acessoControl.getStatementForAction(<any>action);

    if (statement) {
      if (statement.kind === 'filter') {
        try {
          const getDtoClass = statement.getDtoClass;

          if (getDtoClass) {
            if (checkPayload) {
              const validatorClass = this.moduleRef.get(getDtoClass());

              const dto = plainToInstance(validatorClass, checkPayload, {});

              const errors = await validate(validatorClass);

              if (errors.length === 0) {
                can = await acessoControl.checkCanReachTarget(
                  statement.action,
                  null,
                  targetId,
                  <any>dto,
                );

                return {
                  can,
                  _checkStep: '2',
                };
              }
            }
          }
        } catch (error) {}

        return acessoControl
          .checkCanReachTarget(statement.action, null, targetId, null)
          .then((can) => ({
            can,
            _checkStep: '1.0',
          }))
          .catch(() => ({
            can: false,
            _checkStep: '1.1',
          }));
      } else {
        throw new BadRequestException(
          "A funcionalidade 'checkCanReachTarget' só pode ser usado para statements do tipo 'filter'.",
        );
      }
    }

    return {
      can,
      _checkStep: '0',
    };
  }
}
