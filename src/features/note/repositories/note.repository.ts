import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Note, NoteDocument } from '../note.schema';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/features/user/user.service';
import { CreateNotepadDto } from '../dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NoteRepository {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private readonly userService: UserService,
  ) {}

  public async createNote(
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

  public async removeNotepad(noteId: string, loggedUserId: string) {
    const notepad = await this.noteModel.findById(noteId);
    const user = await this.userService.findById(loggedUserId);

    if (!notepad) throw new BadRequestException('Notepad not found');

    if (notepad.author.equals(user._id)) {
      throw new UnauthorizedException(
        'You are not allowed to delete this notepad',
      );
    }

    return this.noteModel.findByIdAndDelete(notepad._id) && user.save();
  }

  public async findNote(noteId: string, loggedUserId: string | Types.ObjectId) {
    const notepad = await this.noteModel.findById({ _id: noteId });

    if (!notepad.author.equals(loggedUserId)) {
      throw new UnauthorizedException('Access Denied!');
    }

    return notepad;
  }
}
