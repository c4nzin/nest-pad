import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { Config, ENV } from './config';

export function setupSwagger(app: NestExpressApplication): void {
  const config = app.get<Config>(ENV);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Memo pal')
    .setDescription('Api')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('notes')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
  });

  const customSwaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  SwaggerModule.setup(
    config.GLOBAL_PREFIX,
    app,
    document,
    customSwaggerOptions,
  );
}
