import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerSetup = async (app: INestApplication, prefix = '/') => {
  const config = new DocumentBuilder()
    .setTitle('API - Microsserviço Fila de Espera')
    .setDescription('Recursos do Microsserviço Fila de Espera')
    .setVersion('1.0')
    // .addServer('http://localhost:3002')
    // .addServer('https://fila-de-espera-api.dev.tcero.tc.br:8888')
    // .addServer('https://fila-de-espera-api.stage.tcero.tc.br:8888')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${prefix}swagger`, app, document);

  return { document };
};
