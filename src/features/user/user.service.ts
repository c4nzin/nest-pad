import { Injectable } from '@nestjs/common';
import { FilterQuery, Types, UpdateWriteOpResult } from 'mongoose';
import { RegisterDto, RefreshTokenDto } from '../auth/dto';
import { UserDocument } from './user.schema';
import { UserRepository, userReturnType } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(registerDto: RegisterDto): Promise<UserDocument> {
    return await this.userRepository.createUser(registerDto);
  }

  public async findById(
    userId: string | Types.ObjectId,
  ): Promise<UserDocument> {
    return this.userRepository.findUserById(userId);
  }

  public async findByEmail(email: string): Promise<UserDocument> {
    return this.userRepository.findByEmail(email);
  }

  public async findByUsername(username: string): Promise<UserDocument> {
    return await this.userRepository.findByUsername(username);
  }

  public async findByUsernameAndEmail(
    email: string,
    username: string,
  ): Promise<FilterQuery<UserDocument>> {
    return await this.userRepository.findByUsenameAndMail(email, username);
  }

  public async updateRefreshToken(
    loggedUserId: string | Types.ObjectId,
    updateDto: RefreshTokenDto,
  ): Promise<UserDocument> {
    return await this.userRepository.updateRefreshToken(
      loggedUserId,
      updateDto,
    );
  }

  public async addNoteToUser(
    loggedUserId: string | Types.ObjectId,
    newNoteId: Types.ObjectId,
  ): Promise<UpdateWriteOpResult> {
    return await this.userRepository.addNoteToUser(loggedUserId, newNoteId);
  }

  public async deleteItemFromArray(
    loggedUserId: string,
    noteId: string,
  ): Promise<UpdateWriteOpResult> {
    return await this.userRepository.deleteNote(loggedUserId, noteId);
  }

  public async loggedUser(username: string): Promise<userReturnType> {
    return this.userRepository.loggedUser(username);
  }
}
