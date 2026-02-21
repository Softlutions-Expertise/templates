import { Global, Module } from '@nestjs/common';
import { ArquivoService } from './arquivo.service';
import { MinioModule } from './minio/minio.module';

@Global()
@Module({
  imports: [MinioModule],
  controllers: [],
  providers: [ArquivoService],
  exports: [ArquivoService],
})
export class ArquivoModule {}
