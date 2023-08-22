import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Config, ENV } from 'src/config';
import { JwtPayload } from 'src/core/interfaces/';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(ENV) configService: Config) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.JWT_ACCESS_SECRET,
    });
  }

  public validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
