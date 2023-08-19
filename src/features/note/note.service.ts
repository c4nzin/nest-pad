import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note, NoteDocument } from './note.schema';
import { Model } from 'mongoose';
import { CreateNotepadDto } from './dto/create-notepad.dto';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private readonly usersService: UserService,
  ) {}

  public async create(
    createNotepadDto: CreateNotepadDto,
    username: string,
  ): Promise<NoteDocument> {
    const user = await this.usersService.findByUsername(username);
    const notepad = await this.noteModel.create({
      ...createNotepadDto,
      author: user._id,
    });
    await this.usersService.updateArray(user._id, notepad._id);
    return notepad.save();
  }

  public async delete(
    toDeleteNotepadId: string,
    requestId: string,
  ): Promise<UserDocument> {
    const note = await this.noteModel.findById({ _id: toDeleteNotepadId });
    const user = await this.usersService.findById(requestId);

    if (!note) {
      throw new BadRequestException('Notepad is not found');
    }

    if (!note.author.equals(requestId)) {
      throw new BadRequestException(
        'You are not authorized to delete this note',
      );
    }

    await this.noteModel.findByIdAndDelete(toDeleteNotepadId);

    // Somehow this code ain't running. Will be fixed soon
    // NEED TO BE FIXED: await this.usersService.deleteItemFromArray(requestId, toDeleteNotepadId);

    // Alternative one but it has only plain javascript.
    // I will use it temporarily.
    user.notes = user.notes.filter((id) => id != note.id);

    return user.save();
  }
}
