import type { Readable } from "node:stream";
import { Client } from "minio";
import { appConfig } from "../../../config";
import { withJitCache } from "../../jit-cache";
import { logger } from "../../logger";

export class MinioService {
  readonly client: Client;
  readonly bucket: string;

  constructor() {
    this.client = new Client({
      endPoint: appConfig.minio.connection.endPoint,
      port: appConfig.minio.connection.port,
      useSSL: appConfig.minio.connection.useSSL,
      accessKey: appConfig.minio.connection.accessKey.getSecret(),
      secretKey: appConfig.minio.connection.secretKey.getSecret(),
    });

    this.bucket = appConfig.minio.modules.pdfs.bucketName;
  }

  async uploadPdf(
    stream: Readable | Buffer | string,
    filename: string,
  ): Promise<string> {
    try {
      const bucketExists = await this.client.bucketExists(this.bucket);

      if (!bucketExists) {
        logger.debug(`Bucket ${this.bucket} does not exist. `);
      }

      await this.client.putObject(this.bucket, filename, stream, undefined, {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
      });

      const url = await this.client.presignedGetObject(
        this.bucket,
        filename,
        appConfig.minio.modules.pdfs.expirationViewUrl,
      );

      logger.debug(`PDF uploaded to Minio: ${filename}`);
      return url;
    } catch (error) {
      logger.error("Error uploading to Minio:", error);
      throw error;
    }
  }
}

export const jitMinioService = withJitCache(() => new MinioService());
