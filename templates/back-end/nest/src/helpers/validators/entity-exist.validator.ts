import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
@ValidatorConstraint({ async: true })
export class EntityExistConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [entityClass, field = 'id'] = args.constraints;

    if (!value) {
      return true;
    }

    const repository = this.dataSource.getRepository(entityClass);
    const entity = await repository.findOne({
      where: { [field]: value },
    });

    return !!entity;
  }

  defaultMessage(args: ValidationArguments): string {
    const [entityClass, field = 'id'] = args.constraints;
    return `${entityClass.name} with ${field} ${args.value} does not exist`;
  }
}

export function EntityExist(
  entityClass: any,
  field?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entityClass, field],
      validator: EntityExistConstraint,
    });
  };
}
