import { Provider } from '@nestjs/common';
import * as Minio from 'minio';

export const MinioClient = Symbol.for('MinioClient');
export type MinioClient = Minio.Client;

export const MINIO_CLIENT_PROVIDER = {
  provide: MinioClient,

  useFactory: async () => {
    return new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  },
} satisfies Provider;
