import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note, NoteDocument } from './note.schema';
import { Model, Types } from 'mongoose';
import { CreateNotepadDto } from './dto';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/user.schema';
import { UpdateNoteDto } from './dto/update-notepad.dto';
import { NoteRepository } from './repositories/note.repository';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private readonly userService: UserService,
    //New
    private readonly noteRepository: NoteRepository,
  ) {}

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

  //Need to be refactored
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
    const note = await this.findNoteById(noteId, userId);

    if (!note) {
      throw new BadRequestException('Note not found');
    }

    if (!note.author.equals(userId)) {
      throw new BadRequestException(
        'You are not authorized to update this note',
      );
    }

    note.set(updateDto);
    return note.save();
  }
}
