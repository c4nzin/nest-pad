import { Inject, Injectable } from '@nestjs/common';
import { JwtOptionsFactory, JwtSignOptions } from '@nestjs/jwt';
import { Config, ENV } from 'src/config';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(@Inject(ENV) private config: Config) {}
  public createJwtOptions(): JwtSignOptions {
    return {
      secret: this.config.JWT_ACCESS_SECRET,
      expiresIn: this.config.EXPIRES_IN,
    };
  }
}
