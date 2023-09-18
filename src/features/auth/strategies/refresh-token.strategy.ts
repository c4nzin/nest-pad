import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { Config, ENV } from 'src/config';
import { JwtPayload } from 'src/core/interfaces';
import { JWT_REFRESH } from './strategies.constants';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH,
) {
  constructor(@Inject(ENV) private readonly configService: Config) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.JWT_REFRESH_SECRET,
    });
  }

  public validate(req: Request, payload: JwtPayload): unknown {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
