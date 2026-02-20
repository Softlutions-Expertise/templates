import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client as MinioClient } from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private client: MinioClient;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME', 'reports');
  }

  async onModuleInit(): Promise<void> {
    this.client = new MinioClient({
      endPoint: this.configService.get('MINIO_HOST', 'localhost'),
      port: parseInt(this.configService.get('MINIO_PORT', '9000'), 10),
      useSSL: this.configService.get('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get('MINIO_SECRET_KEY', 'minioadmin'),
    });

    await this.createBucketIfNotExists();
  }

  private async createBucketIfNotExists(): Promise<void> {
    try {
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName, '');
        this.logger.log(`Bucket '${this.bucketName}' created`);
      }
    } catch (error) {
      this.logger.error(`Failed to create bucket: ${error.message}`);
    }
  }

  async uploadPdf(buffer: Buffer, filename: string): Promise<string> {
    await this.client.putObject(
      this.bucketName,
      filename,
      buffer,
      buffer.length,
      { 'Content-Type': 'application/pdf' },
    );
    return filename;
  }

  async getPresignedUrl(filename: string, expirySeconds = 3600): Promise<string> {
    return this.client.presignedGetObject(this.bucketName, filename, expirySeconds);
  }
}
