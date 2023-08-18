import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dto';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto';
import { Config, ENV } from 'src/config';
import { UserDocument } from '../user/user.schema';
import { hashData, verifyData } from '../../utils/data-modify'; //will be used in the future
import { TokenResponse } from 'src/core/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(ENV) private readonly config: Config,
  ) {}

  public async register(createUserDto: RegisterDto): Promise<TokenResponse> {
    const user = await this.usersService.findByUsername(createUserDto.username);

    if (user) throw new BadRequestException('User already exists');

    const hashedPassword = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(newUser._id, newUser.username);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);

    return tokens;
  }
}
