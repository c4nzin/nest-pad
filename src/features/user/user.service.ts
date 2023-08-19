import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from '../auth/dto';
import { User, UserDocument } from './user.schema';
import { UpdateDto } from '../auth/dto/update.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async create(createUserDto: RegisterDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  public async findById(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username }).exec();
  }

  public findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username }).exec();
  }

  public async update(id: string, updateDto: UpdateDto): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  public async updateArray(userId: string, note: any): Promise<any> {
    return this.userModel.updateOne(
      { _id: userId },
      { $push: { notes: note } },
    );
  }
}
