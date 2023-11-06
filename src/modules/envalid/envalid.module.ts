import { Module } from '@nestjs/common';
import { EnvalidModule as EnvalidModuleConfig } from 'nestjs-envalid';
import { validators } from 'src/config';
@Module({
  imports: [
    EnvalidModuleConfig.forRoot({
      isGlobal: true,
      validators,
      useDotenv: true,
    }),
  ],
})
export class EnvalidModule {}
