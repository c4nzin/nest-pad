import { Module } from '@nestjs/common';
import { LoggerModule as PinoModule } from 'nestjs-pino';

//Will be removed soon
//Using winston not pino

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
