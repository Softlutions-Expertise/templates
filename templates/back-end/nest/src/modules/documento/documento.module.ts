import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { documentoProvider } from '../providers/documento.provider';
import { DocumentoService } from './documento.service';

@Module({
  imports: [DatabaseModule],
  providers: [...documentoProvider, DocumentoService],
  controllers: [],
  exports: [...documentoProvider, DocumentoService],
})
export class DocumentoModule {}
