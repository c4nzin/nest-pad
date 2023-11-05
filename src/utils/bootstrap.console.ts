import { BadRequestException, INestApplication } from '@nestjs/common';
import {
  BootstrapConsole,
  CommonBootstrapConsoleOptions,
} from 'nestjs-console';
import { AppModule } from 'src/app.module';

const bootstrapConsoleOptions: CommonBootstrapConsoleOptions = {
  module: AppModule,
  useDecorators: true,
};

const bootstrapConsole = new BootstrapConsole(bootstrapConsoleOptions);

bootstrapConsole.init().then(async (app: INestApplication) => {
  try {
    await app.init();
    await bootstrapConsole.boot();
    await app.close();
  } catch (error: any) {
    throw new BadRequestException(error.message);
  }
});
