import { str, port } from 'envalid';
import { makeValidators, Static } from 'nestjs-envalid';

const config = {
  PORT: port({ default: 5000 }),
  DB_URI: str(),
};

export const validators = makeValidators(config);

export type Config = Static<typeof validators>;

export const ENV = 'EnvalidModuleEnv';
