import { Module } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { FeriadosController } from './feriados.controller';
import { FeriadosService } from './feriados.service';

@Module({
  imports: [BaseModule],
  controllers: [FeriadosController],
  exports: [FeriadosService],
  providers: [FeriadosService],
})
export class FeriadosModule { }
