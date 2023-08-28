import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user.schema';
import { Model, Types, UpdateWriteOpResult } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  public getUserByName(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username });
  }

  public async validateUserByName(
    username: string,
  ): Promise<UserDocument | NotFoundException> {
    const user = await this.getUserByName(username);

    if (!user) throw new NotFoundException('Username is not found');

    return user;
  }

  public async getUserByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email });
  }

  public async validateUserByEmail(
    email: string,
  ): Promise<UserDocument | NotFoundException> {
    const user = await this.getUserByEmail(email);

    if (!user) throw new NotFoundException('Email is not found');

    return user;
  }

  public getUserById(id: string): Promise<UserDocument> {
    return this.userModel.findOne({ id });
  }

  public async validateUserById(
    id: string,
  ): Promise<UserDocument | NotFoundException> {
    const user = await this.getUserById(id);

    if (!user) throw new NotFoundException('User with the id was not found');

    return user;
  }

  public async getUser(
    username: string,
    email: string,
  ): Promise<UserDocument[]> {
    const user = this.userModel.find({ $or: [{ username }, { email }] });
    return user;
  }

  public async addNoteToUser(
    userId: string | Types.ObjectId,
    newNoteId: Types.ObjectId,
  ): Promise<UpdateWriteOpResult> {
    return this.userModel.updateOne(
      { _id: userId },
      { $push: { notes: newNoteId } },
    );
  }

  public async deleteNotepadFromUserId(
    userId: string,
    noteId: string,
  ): Promise<UpdateWriteOpResult> {
    return this.userModel.updateOne(
      { _id: userId },
      { $pull: { notes: noteId } },
    );
  }
}
