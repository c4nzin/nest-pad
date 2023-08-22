import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateWriteOpResult } from 'mongoose';
import { RegisterDto, RefreshTokenDto } from '../auth/dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async create(createUserDto: RegisterDto): Promise<UserDocument> {
    return new this.userModel(createUserDto);
  }

  public async findById(
    userId: string | Types.ObjectId,
  ): Promise<UserDocument> {
    return this.userModel.findById({ _id: userId });
  }

  public async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  public findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username });
  }

  public findByUsernameAndEmail(
    email: string,
    username: string,
  ): Promise<UserDocument> {
    return this.userModel.findOne({ $or: [{ username }, { email }] });
  }

  public async updateRefreshToken(
    id: string | Types.ObjectId,
    updateDto: RefreshTokenDto,
  ): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  public async updateArray(
    userId: string | Types.ObjectId,
    noteId: Types.ObjectId,
  ): Promise<UpdateWriteOpResult> {
    return this.userModel.updateOne(
      { _id: userId },
      { $push: { notes: noteId } },
    );
  }

  public async deleteItemFromArray(
    userId: string,
    noteId: string,
  ): Promise<UpdateWriteOpResult> {
    return this.userModel.updateOne(
      { _id: userId },
      { $pull: { notes: noteId } },
    );
  }
}
