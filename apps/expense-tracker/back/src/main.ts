import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { ForeignKeyViolationInterceptor } from './helpers/interceptors/foreign-key-violation.interceptor';

// ----------------------------------------------------------------------

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get('PORT') || 3001;
  const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:8085';

  console.log('🔧 Configurações:');
  console.log(`   Port: ${port}`);
  console.log(`   Frontend URL: ${frontendUrl}`);

  // CORS
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:8085', 'http://127.0.0.1:8085'],
    credentials: true,
  });

  // API Prefix
  app.setGlobalPrefix('api/v1');

  // Validation - ⚠️ NÃO use forbidNonWhitelisted: true
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
      validationError: { target: false, value: false },
    }),
  );

  // Interceptors
  app.useGlobalInterceptors(new ForeignKeyViolationInterceptor());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Swagger
  const { DocumentBuilder, SwaggerModule } = await import('@nestjs/swagger');
  const config = new DocumentBuilder()
    .setTitle('Expense Tracker API')
    .setDescription('API de Controle de Despesas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`\n🚀 Server running on http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger: http://localhost:${port}/api/docs\n`);
}

bootstrap();
