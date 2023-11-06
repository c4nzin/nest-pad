import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user.schema';
import { FilterQuery, Model, Types, UpdateWriteOpResult } from 'mongoose';
import { RefreshTokenDto, RegisterDto } from 'src/features/auth/dto';

export type userReturnType = {
  username: string;
  id: Types.ObjectId;
  password: string;
  email: string;
  notes: Types.ObjectId[];
};

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async validateFindUserById(
    userId: string | Types.ObjectId,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('No user found');
    }

    return user;
  }

  public async validateFindByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username });

    if (!user) throw new NotFoundException('No user found');

    return user;
  }

  public async findByUsername(username: string): Promise<UserDocument> {
    return this.validateFindByUsername(username);
  }

  public findUserById(userId: string | Types.ObjectId): Promise<UserDocument> {
    return this.validateFindUserById(userId);
  }

  public async createUser(registerDto: RegisterDto): Promise<UserDocument> {
    try {
      const user = new this.userModel(registerDto);
      return await user.save();
    } catch (error: any) {
      throw new BadRequestException(error);
    }
  }

  public async validateFindByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('No user with this email');
    }

    return user;
  }

  public findByEmail(email: string): UserDocument {
    return this.findByEmail(email);
  }

  public async findByUsenameAndMail(
    email: string,
    username: string,
  ): Promise<FilterQuery<UserDocument>> {
    return await this.userModel.find({ $or: [{ email }, { username }] });
  }

  public async updateRefreshToken(
    loggedUserId: string | Types.ObjectId,
    update: RefreshTokenDto,
  ): Promise<UserDocument> {
    return await this.userModel.findByIdAndUpdate(loggedUserId, update, {
      new: true,
    });
  }

  public async addNoteToUser(
    loggedUserId: string | Types.ObjectId,
    noteId: Types.ObjectId,
  ): Promise<UpdateWriteOpResult> {
    return await this.userModel.updateOne(
      { _id: loggedUserId },
      { $push: { notes: noteId } },
    );
  }

  public async deleteNote(
    loggedUserId: string,
    noteId: string,
  ): Promise<UpdateWriteOpResult> {
    return await this.userModel.updateOne(
      { _id: loggedUserId },
      { $pull: { notes: noteId } },
    );
  }

  public async validateLoggedUser(username: string): Promise<userReturnType> {
    const user = await this.findByUsername(username);

    if (!user) throw new NotFoundException('No user found');

    const modifiedUser: userReturnType = {
      username: user.username,
      id: user.id,
      password: user.password,
      email: user.email,
      notes: user.notes,
    };

    return modifiedUser;
  }

  public async loggedUser(username: string): Promise<userReturnType> {
    return this.validateLoggedUser(username);
  }
}
