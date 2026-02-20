import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { swaggerSetup } from './config/swagger.config';
import { ForeignKeyViolationInterceptor } from './helpers/interceptors/foreign-key-violation.interceptor';
import './instrument';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envCorsOrigins = process.env.CORS_ALLOWED_ORIGINS;

  const origins = envCorsOrigins ? envCorsOrigins.split(',') : undefined;

  app.enableCors({
    origin: origins && origins.length === 1 ? origins[0] : origins,
  });

  const prefix = process.env.PREFIX ?? '/';

  app.setGlobalPrefix(prefix);

  app.use(bodyParser.json({ limit: '50mb' }));

  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
  );

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
  
  const port = process.env.API_PORT;
  console.log(`bom dia :${port}`);
  await app.listen(port);
}
bootstrap();
