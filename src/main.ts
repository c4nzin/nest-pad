import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Config, ENV } from './config';
import { ExceptionFilter } from './core/filters';
import { TransformInterceptor } from './core/interceptors';
import { swaggerConfig } from './setup-swagger';
import { SwaggerModule } from '@nestjs/swagger';
import expressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const config = app.get<Config>(ENV);

  app.use(
    expressMongoSanitize({
      allowDots: true,
      replaceWith: '_',
      dryRun: true,
    }),
  );

  app.use(helmet());

  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix(config.GLOBAL_PREFIX);

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(config.GLOBAL_PREFIX, app, document);

  await app.listen(config.PORT);
}
bootstrap();
