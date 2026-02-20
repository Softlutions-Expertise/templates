import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8085',
    credentials: true,
  });

  const port = process.env.PORT || 3002;
  await app.listen(port);
  
  console.log(`Report Service running on port ${port}`);
}
bootstrap();
