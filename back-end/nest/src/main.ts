import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API Prefix
  const prefix = configService.get<string>('PREFIX') || '/api/v1/';
  app.setGlobalPrefix(prefix);

  // CORS
  const corsOrigins = configService.get<string>('CORS_ALLOWED_ORIGINS') || '';
  app.enableCors({
    origin: corsOrigins.split(',').map((origin) => origin.trim()),
    credentials: true,
  });

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('API Template')
    .setDescription('Template NestJS com autenticação e estrutura base')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('API_PORT') || 3000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}${prefix}`);
  console.log(`Swagger documentation: http://localhost:${port}${prefix}docs`);
}

bootstrap();
