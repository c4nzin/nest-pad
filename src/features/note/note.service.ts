import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note, NoteDocument } from './note.schema';
import { Model } from 'mongoose';
import { CreateNotepadDto } from './dto';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/user.schema';

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

    await this.userService.updateArray(user._id, notepad._id);
    return notepad.save();
  }

  public async delete(
    notepadId: string,
    activeUserId: string,
  ): Promise<UserDocument> {
    const note = await this.noteModel.findById({ _id: notepadId });
    const user = await this.userService.findById(activeUserId);

    if (!note) {
      throw new BadRequestException('Notepad is not found');
    }

    if (!note.author.equals(activeUserId)) {
      throw new BadRequestException(
        'You are not authorized to delete this note',
      );
    }

    await this.noteModel.findByIdAndDelete(notepadId);

    // Somehow this code ain't running. Will be fixed soon
    // NEED TO BE FIXED: await this.usersService.deleteItemFromArray(requestId, toDeleteNotepadId);

    // Alternative one but it has only plain javascript.
    // I will use it temporarily.
    user.notes = user.notes.filter((id) => id != note.id);

    return user.save();
  }
}
