import { Module } from '@nestjs/common';
import { LoggerModule as PinoModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              level: 'info',
              options: {},
            },
          ],
        },
      },
    }),
  ],
})
export class LoggerModule {}
