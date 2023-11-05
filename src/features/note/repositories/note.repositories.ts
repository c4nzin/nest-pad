import { Inject, Injectable } from '@nestjs/common';
import { Note, NoteDocument } from '../note.schema';
import { Model } from 'mongoose';
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

  public removeNotepad() {}
}
