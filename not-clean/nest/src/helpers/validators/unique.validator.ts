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

interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [
    ObjectType<E> | EntitySchema<E> | string,
    (
      | ((validationArguments: ValidationArguments) => FindOptionsWhere<E>)
      | keyof E
    ),
  ];
}

export abstract class UniqueValidator implements ValidatorConstraintInterface {
  protected constructor(protected readonly dataSource: DataSource) {}

  public async validate<E>(value: string, args: UniqueValidationArguments<E>) {
    const [EntityClass, findCondition = args.property] = args.constraints;
    const repository = this.dataSource.getRepository(EntityClass);

    return (
      (await repository.count({
        where:
          typeof findCondition === 'function'
            ? findCondition(args)
            : ({
                [findCondition || args.property]: value,
              } as any),
      })) <= 0
    );
  }

  public defaultMessage(args: ValidationArguments) {
    const [EntityClass] = args.constraints;
    let entity = EntityClass.name || 'Entity';

    entity = entity.replace('Entity', '');
    const property = args.property.replace(/([A-Z])/g, ' $1').toLowerCase();

    return `${entity} com o mesmo '${property}' já existe`;
  }
}
