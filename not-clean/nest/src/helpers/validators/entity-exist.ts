import { ValidatorConstraint } from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EntityExistValidator } from './entity-exist.validator';

@ValidatorConstraint({ name: 'entity-exist', async: true })
@Injectable()
export class EntityExist extends EntityExistValidator {
  constructor(
    @Inject('DATA_SOURCE')
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }
}
