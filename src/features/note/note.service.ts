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
import { NoteRepository } from './repositories/note.repositories';

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
    // Somehow this code ain't running. Will be fixed soon
    // NEED TO BE FIXED: await this.usersService.deleteItemFromArray(requestId, toDeleteNotepadId);
    // Alternative one but it has only plain javascript.
    // I will use it temporarily.
    // user.notes = user.notes.filter((id) => id !== noteToDelete._id);
  }

  //Need to be refactored
  public async findNoteById(
    noteId: string,
    userId: Types.ObjectId | string,
  ): Promise<NoteDocument> {
    const note = await this.noteModel.findById({ _id: noteId });

    if (!note.author._id.equals(userId) || !note)
      throw new UnauthorizedException('Access denied');

    return note;
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
