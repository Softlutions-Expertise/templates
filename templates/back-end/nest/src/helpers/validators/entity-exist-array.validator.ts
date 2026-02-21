import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  DataSource,
  EntitySchema,
  FindOptionsWhere,
  In,
  ObjectType,
} from 'typeorm';
import { isObject } from '@nestjs/common/utils/shared.utils';

export interface EntityExistArrayValidationArguments<E>
  extends ValidationArguments {
  constraints: [
    ObjectType<E> | EntitySchema<E> | string,
    (
      | ((
          validationArguments: ValidationArguments,
          value: any[],
        ) => FindOptionsWhere<E>)
      | keyof E
    ),
    (
      | ((
          validationArguments: ValidationArguments,
          value: any[],
          entityCount: number,
        ) => boolean)
      | string
      | undefined
    ),
    number | undefined, // DB count result for (use only for customizing message)
  ];
}

export abstract class EntityExistArrayValidator
  implements ValidatorConstraintInterface
{
  protected constructor(protected readonly dataSource: DataSource) {}

  public async validate<E>(
    value: object[],
    args: EntityExistArrayValidationArguments<E>,
  ) {
    const [EntityClass, findCondition = args.property, validationCondition] =
      args.constraints;
    if (value == undefined || !value.length) {
      return true; // allows empty array
    }

    const entityCount = await this.dataSource.getRepository(EntityClass).count({
      where:
        typeof findCondition === 'function'
          ? findCondition(args, value)
          : ({
              [findCondition]: In(
                validationCondition && typeof validationCondition !== 'function'
                  ? value.map((val) =>
                      isObject(val) ? val[validationCondition] : val,
                    )
                  : value,
              ),
            } as any),
    });

    args.constraints[3] = entityCount;

    return typeof validationCondition === 'function'
      ? validationCondition(args, value, entityCount)
      : value.length === entityCount;
  }

  public defaultMessage(args: ValidationArguments) {
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name || 'Entity';
    return `Some Entity:${entity.toLowerCase()} does not exist`;
  }
}
