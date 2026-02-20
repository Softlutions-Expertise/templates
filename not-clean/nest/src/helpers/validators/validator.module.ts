import { Module } from '@nestjs/common';
import { EntityExist } from './entity-exist';
import { Unique } from './unique';
import { EntityExistArray } from './entity-exist-array';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [EntityExist, EntityExistArray, Unique],
  exports: [EntityExist, EntityExistArray, Unique],
})
export class ValidatorModule {}
