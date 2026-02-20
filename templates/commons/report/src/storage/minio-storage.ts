import { Client as MinioClient } from 'minio';

// ----------------------------------------------------------------------

export interface StorageConfig {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucketName: string;
}

// ----------------------------------------------------------------------

export class ReportStorage {
  private client: MinioClient;
  private bucketName: string;

  constructor(config: StorageConfig) {
    this.client = new MinioClient({
      endPoint: config.endPoint,
      port: config.port,
      useSSL: config.useSSL,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
    });
    this.bucketName = config.bucketName;
  }

  async uploadPdf(buffer: Buffer, filename: string): Promise<string> {
    const exists = await this.client.bucketExists(this.bucketName);
    if (!exists) {
      await this.client.makeBucket(this.bucketName);
    }

    await this.client.putObject(
      this.bucketName,
      filename,
      buffer,
      buffer.length,
      { 'Content-Type': 'application/pdf' }
    );

    return await this.client.presignedGetObject(
      this.bucketName,
      filename,
      24 * 60 * 60
    );
  }

  async uploadHtml(buffer: Buffer, filename: string): Promise<string> {
    const exists = await this.client.bucketExists(this.bucketName);
    if (!exists) {
      await this.client.makeBucket(this.bucketName);
    }

    await this.client.putObject(
      this.bucketName,
      filename,
      buffer,
      buffer.length,
      { 'Content-Type': 'text/html' }
    );

    return await this.client.presignedGetObject(
      this.bucketName,
      filename,
      24 * 60 * 60
    );
  }
}
