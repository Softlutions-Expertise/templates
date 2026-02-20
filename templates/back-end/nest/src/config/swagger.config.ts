import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// ----------------------------------------------------------------------

export async function swaggerSetup(app: INestApplication, prefix: string) {
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation with Swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/docs`, app, document);
}
