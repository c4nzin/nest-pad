import { format, transports } from 'winston';
import { WinstonModuleOptions, utilities } from 'nest-winston';

export default {
  format: format.colorize(),
  exitOnError: false,
  transports: new transports.Console({
    format: format.combine(
      format.timestamp(),
      format.ms(),
      utilities.format.nestLike('Nestpad logger', {
        prettyPrint: true,
      }),
    ),
  }),
} as WinstonModuleOptions;
