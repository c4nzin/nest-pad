import { Module } from '@nestjs/common';
import { EnvalidModule } from 'nestjs-envalid';
import { validators } from './config';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    EnvalidModule.forRoot({
      isGlobal: true,
      validators,
      useDotenv: true,
    }),
    AuthModule,

    DatabaseModule,
  ],
})
export class AppModule {}
