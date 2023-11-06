import { Injectable } from '@nestjs/common';
import { NoteDocument } from './note.schema';
import { Types } from 'mongoose';
import { CreateNotepadDto } from './dto';
import { UserDocument } from '../user/user.schema';
import { UpdateNoteDto } from './dto/update-notepad.dto';
import { NoteRepository } from './repositories/note.repository';

@Injectable()
export class NoteService {
  constructor(private readonly noteRepository: NoteRepository) {}

  public async create(
    createNotepadDto: CreateNotepadDto,
    username: string,
  ): Promise<NoteDocument> {
    return this.noteRepository.createNote(createNotepadDto, username);
  }

  public async deleteNotepadById(
    notepadId: string,
    activeUserId: string,
  ): Promise<UserDocument> {
    return this.noteRepository.removeNotepad(notepadId, activeUserId);
    // NEED TO BE FIXED: await this.usersService.deleteItemFromArray(requestId, toDeleteNotepadId);
  }

  public async findNoteById(
    noteId: string,
    userId: Types.ObjectId | string,
  ): Promise<NoteDocument> {
    return this.noteRepository.findNote(noteId, userId);
  }

  public async updateNoteById(
    noteId: string,
    userId: Types.ObjectId | string,
    updateDto: UpdateNoteDto,
  ): Promise<NoteDocument> {
    return this.noteRepository.updateNotepad(noteId, userId, updateDto);
  }
}
