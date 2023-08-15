import { Inject, Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { Config, ENV } from 'src/config';

@Injectable()
export class DatabaseConfigService implements MongooseOptionsFactory {
  constructor(@Inject(ENV) private readonly config: Config) {}

  public async createMongooseOptions(): Promise<MongooseModuleOptions> {
    const uri = this.config.DB_URI;
    return { uri };
  }
}
