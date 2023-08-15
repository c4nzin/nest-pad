import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userRepository: Model<User>) {}

  public async register(registerDto: RegisterDto) {
    const user = await this.userRepository.create(registerDto);
    return user;
  }
}
