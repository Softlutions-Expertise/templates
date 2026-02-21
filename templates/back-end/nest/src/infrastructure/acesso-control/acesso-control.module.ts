import { Global, Module } from '@nestjs/common';
import { AuthorizationModule } from '../authorization';
import { AcessoControlService } from './acesso-control.service';

@Global()
@Module({
  imports: [AuthorizationModule],
  controllers: [],
  providers: [AcessoControlService],
  exports: [AcessoControlService],
})
export class AcessoControlModule {}
