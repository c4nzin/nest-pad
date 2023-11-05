import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user.schema';
import { Model, Types } from 'mongoose';
import { RegisterDto } from 'src/features/auth/dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async validateFindUserById(userId: string | Types.ObjectId) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('No user found');
    }

    return user;
  }

  public findUserById(userId: string | Types.ObjectId) {
    return this.validateFindUserById(userId);
  }

  public async createUser(registerDto: RegisterDto) {
    return await new this.userModel(registerDto).save();
  }

  public async validateFindByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('No user with this email');
    }
  }

  public findByEmail(email: string) {
    return this.findByEmail(email);
  }
}
