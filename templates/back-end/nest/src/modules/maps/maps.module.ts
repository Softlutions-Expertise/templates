import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { pessoaProvider } from '../providers/pessoa.provider';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MapsController],
  providers: [MapsService, ...pessoaProvider],
})
export class MapsModule {}
