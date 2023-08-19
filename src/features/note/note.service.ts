import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note, NoteDocument } from './note.schema';
import { Model } from 'mongoose';
import { CreateNotepadDto } from './dto/create-notepad.dto';
import { UserService } from '../user/user.service';

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
}
