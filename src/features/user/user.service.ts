import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { RegisterDto } from '../auth/dto';
import { User, UserDocument } from './user.schema';
import { UpdateDto } from '../auth/dto/update.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async create(createUserDto: RegisterDto): Promise<UserDocument> {
    return new this.userModel(createUserDto);
  }

  public async findById(userId: string): Promise<UserDocument> {
    return this.userModel.findById({ _id: userId });
  }

  public async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  public findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username });
  }

  public async update(id: string, updateDto: UpdateDto): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  public async updateArray(userId: string, note: any): Promise<any> {
    return this.userModel.updateOne(
      { _id: userId },
      { $push: { notes: note } },
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
