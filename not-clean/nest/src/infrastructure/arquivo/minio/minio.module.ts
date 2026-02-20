import { Module } from "@nestjs/common";
import { MINIO_CLIENT_PROVIDER } from "./providers/minio-client.provider";

@Module({
  imports: [],
  controllers: [],
  providers: [MINIO_CLIENT_PROVIDER],
  exports: [MINIO_CLIENT_PROVIDER],    
})
export class MinioModule {}