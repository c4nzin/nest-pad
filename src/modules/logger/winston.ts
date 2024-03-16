import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as winstonMongoDb from 'winston-mongodb';

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, context, trace }) => {
        return `${timestamp} [${context}] ${level}: ${message}${
          trace ? `\n${trace}` : ''
        }`;
      }),
    ),
  }),

  new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  }),

  //Mongodb log support
  new winstonMongoDb.MongoDB({
    level: 'info',
    db: `${process.env.DB_URI}/logs_db`,
    options: {
      useUnifiedTopology: true,
      autoReconnect: true,
      useNewUrlParser: true,
    },
    collection: 'logs',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  }),
];

export const logger = winston.createLogger({
  level: 'info',
  transports,
  format: winston.format.json(),
});
