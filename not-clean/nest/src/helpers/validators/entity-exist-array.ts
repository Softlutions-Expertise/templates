import { ValidatorConstraint } from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EntityExistArrayValidator } from './entity-exist-array.validator';

@ValidatorConstraint({ name: 'entity-exist-array', async: true })
@Injectable()
export class EntityExistArray extends EntityExistArrayValidator {
  constructor(
    @Inject('DATA_SOURCE')
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }
}
