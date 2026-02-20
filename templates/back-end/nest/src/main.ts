import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { swaggerSetup } from './config/swagger.config';
import { ForeignKeyViolationInterceptor } from './helpers/interceptors/foreign-key-violation.interceptor';

// ----------------------------------------------------------------------

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envCorsOrigins = process.env.CORS_ALLOWED_ORIGINS;
  const origins = envCorsOrigins ? envCorsOrigins.split(',') : '*';

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  const prefix = process.env.API_PREFIX ?? '/api/v1';
  app.setGlobalPrefix(prefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(errors);
      },
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  app.useGlobalInterceptors(new ForeignKeyViolationInterceptor());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await swaggerSetup(app, prefix);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}${prefix}`);
}
bootstrap();
