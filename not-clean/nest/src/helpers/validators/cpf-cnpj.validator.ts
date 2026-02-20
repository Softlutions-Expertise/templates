import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { isCPF, isCNPJ } from 'brazilian-values';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) {
            return true;
          }

          return isCPF(value);
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} inválido`;
        },
      },
    });
  };
}

export function IsCNPJ(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCNPJ',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) {
            return true;
          }

          return isCNPJ(value);
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} inválido`;
        },
      },
    });
  };
}
