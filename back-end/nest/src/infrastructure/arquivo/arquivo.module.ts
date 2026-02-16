import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArquivoService } from './arquivo.service';
import { Arquivo } from './entities/arquivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Arquivo])],
  providers: [ArquivoService],
  exports: [ArquivoService],
})
export class ArquivoModule {}
