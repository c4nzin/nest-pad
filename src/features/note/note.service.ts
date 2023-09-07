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

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private readonly userService: UserService,
  ) {}

  public async create(
    createNotepadDto: CreateNotepadDto,
    username: string,
  ): Promise<NoteDocument> {
    const user = await this.userService.findByUsername(username);

    const notepad = await this.noteModel.create({
      ...createNotepadDto,
      author: user._id,
    });

    await this.userService.addNoteToUser(user._id, notepad._id);
    return notepad.save();
  }

  public async deleteNotepadById(
    notepadId: string,
    activeUserId: string,
  ): Promise<UserDocument> {
    const noteToDelete = await this.noteModel.findById({ _id: notepadId });
    const user = await this.userService.findById(activeUserId);

    if (!noteToDelete) {
      throw new BadRequestException('Notepad not found');
    }

    if (!noteToDelete.author.equals(activeUserId)) {
      throw new BadRequestException(
        'You are not authorized to delete this note',
      );
    }

    await this.noteModel.findByIdAndDelete(notepadId);

    // Somehow this code ain't running. Will be fixed soon
    // NEED TO BE FIXED: await this.usersService.deleteItemFromArray(requestId, toDeleteNotepadId);

    // Alternative one but it has only plain javascript.
    // I will use it temporarily.
    user.notes = user.notes.filter((id) => id !== noteToDelete._id);

    return user.save();
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
