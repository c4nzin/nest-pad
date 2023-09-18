import { str, port, num } from 'envalid';
import { makeValidators, Static } from 'nestjs-envalid';

const config = {
  PORT: port({ default: 5000 }),
  DB_URI: str(),
  GLOBAL_PREFIX: str({ default: 'api' }),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  EXPIRES_IN: str({ default: '15m' }),
  REFRESH_TIME: str({ default: '1d' }),
  THROTTLE_TTL: num({ default: 60 }),
  THROTTLE_LIMIT: num({ default: 10 }),
  ORIGIN: str({ default: 'http://localhost:3000' }),
};

export const validators = makeValidators(config);

export type Config = Static<typeof validators>;

export const ENV = 'EnvalidModuleEnv';
