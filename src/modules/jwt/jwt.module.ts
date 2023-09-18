import { Module } from '@nestjs/common';
import { JwtModule as JwtModuleHost } from '@nestjs/jwt';
import { JwtConfigService } from './jwt-config.service';

@Module({
  imports: [
    JwtModuleHost.registerAsync({ global: true, useClass: JwtConfigService }),
  ],
})
export class JwtModule {}
