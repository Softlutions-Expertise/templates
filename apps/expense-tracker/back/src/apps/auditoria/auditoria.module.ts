import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { AuditoriaService } from './auditoria.service';
import { AuditoriaController } from './auditoria.controller';
import { Auditoria } from './entities/auditoria.entity';
import { AuditoriaInterceptor } from './interceptors/auditoria.interceptor';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Auditoria])],
  controllers: [AuditoriaController],
  providers: [
    AuditoriaService, 
    Reflector,
    AuditoriaInterceptor,
  ],
  exports: [AuditoriaService, AuditoriaInterceptor],
})
export class AuditoriaModule {}
