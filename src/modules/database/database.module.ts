import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfigService } from './database.config.service';

@Module({
  imports: [MongooseModule.forRootAsync({ useClass: DatabaseConfigService })],
})
export class DatabaseModule {}
