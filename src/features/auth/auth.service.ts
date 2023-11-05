import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto';
import { TokenService } from 'src/features/auth/token.service';
import { LoginReturnType } from './auth.controller';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public async register(registerDto: RegisterDto): Promise<string> {
    const isUserAlreadyExists = await this.userService.findByUsernameAndEmail(
      registerDto.email,
      registerDto.username,
    );

    if (isUserAlreadyExists.length > 0) {
      throw new BadRequestException('Username or email already registered');
    }

    const hashedPassword = await bcrypt.hashSync(registerDto.password, 10);

    const createdUser = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    const generateTokens = await this.tokenService.generateAndSaveTokens(
      createdUser._id,
      createdUser.username,
    );

    return generateTokens.accessToken;
  }

  public async login(loginDto: LoginDto): Promise<LoginReturnType> {
    const user = await this.userService.findByUsername(loginDto.username);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const isPasswordMatches = await bcrypt.compareSync(
      loginDto.password,
      user.password,
    );

    if (isPasswordMatches) {
      throw new BadRequestException('Password is not correct');
    }

    const generateTokens = await this.tokenService.generateAndSaveTokens(
      user._id,
      user.username,
    );

    return {
      refreshToken: generateTokens.refreshToken,
      accessToken: generateTokens.accessToken,
    };
  }

  public async logout(userId: string): Promise<UserDocument> {
    return this.userService.updateRefreshToken(userId, { refreshToken: null });
  }
}
