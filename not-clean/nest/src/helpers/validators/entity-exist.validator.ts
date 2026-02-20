import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  DataSource,
  EntitySchema,
  FindOptionsWhere,
  ObjectType,
} from 'typeorm';
import { isObject } from '@nestjs/common/utils/shared.utils';

export interface EntityExistValidationArguments<E> extends ValidationArguments {
  constraints: [
    ObjectType<E> | EntitySchema<E> | string,
    (
      | ((
          validationArguments: ValidationArguments,
          value: object,
        ) => FindOptionsWhere<E>)
      | keyof E
    ),
    (
      | ((
          validationArguments: ValidationArguments,
          value: object,
          entityCount: number,
        ) => boolean)
      | string
      | undefined
    ),
    number | undefined,
  ];
}

export abstract class EntityExistValidator
  implements ValidatorConstraintInterface
{
  protected constructor(protected readonly dataSource: DataSource) {}

  public async validate<E>(
    value: object[],
    args: EntityExistValidationArguments<E>,
  ) {
    const [EntityClass, findCondition = args.property, validationCondition] =
      args.constraints;

    const entityCount = await this.dataSource.getRepository(EntityClass).count({
      where:
        typeof findCondition === 'function'
          ? findCondition(args, value)
          : ({
              [findCondition]:
                validationCondition && typeof validationCondition !== 'function'
                  ? isObject(value)
                    ? value[validationCondition]
                    : value
                  : value,
            } as any),
    });

    args.constraints[3] = entityCount;

    return typeof validationCondition === 'function'
      ? validationCondition(args, value, entityCount)
      : !!entityCount;
  }

  public defaultMessage(args: ValidationArguments) {
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name || 'Entity';
    const text = Array.isArray(args.value) ? 'Some' : 'The';
    return `${text} Entity:${entity.toLowerCase()} nao existe`;
  }
}
