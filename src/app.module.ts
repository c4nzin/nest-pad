import { Module } from '@nestjs/common';
import { EnvalidModule } from 'nestjs-envalid';
import { validators } from './config';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    EnvalidModule.forRoot({
      isGlobal: true,
      validators,
      useDotenv: true,
    }),
    DatabaseModule,
  ],
})
export class AppModule {}
