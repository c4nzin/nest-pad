import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Config, ENV } from './config';
import { ExceptionFilter } from './core/filters';
import { TransformInterceptor, LoggingInterceptor } from './core/interceptors';
import { setupSwagger } from './setup-swagger';
import expressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import compression from 'compression';
import { Logger } from 'nestjs-pino';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const config = app.get<Config>(ENV);
  const logger = app.get<Logger>(Logger);

  app.use(
    expressMongoSanitize({
      allowDots: true,
      replaceWith: '_',
      dryRun: true,
    }),
  );
  app.use(helmet());
  app.use(compression());

  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  app.setGlobalPrefix(config.GLOBAL_PREFIX);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  setupSwagger(app);
  await app.listen(config.PORT);
}
bootstrap();
