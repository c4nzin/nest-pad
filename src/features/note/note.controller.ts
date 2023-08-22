import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  Delete,
  Param,
} from '@nestjs/common';
import { Message, User } from 'src/core/decorators';
import { NoteService } from './note.service';
import { AccessTokenGuard } from 'src/core/guards';
import { ApiTags } from '@nestjs/swagger';
import { CreateNotepadDto } from './dto/create-notepad.dto';
import { NoteDocument } from './note.schema';
import { UserDocument } from '../user/user.schema';

@Controller()
@UseGuards(AccessTokenGuard)
@ApiTags('Notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('create')
  @Message('Sucessfully created note')
  public async createNote(
    @Body() createNotepadDto: CreateNotepadDto,
    @User('username') username: string,
  ): Promise<NoteDocument> {
    return this.noteService.create(createNotepadDto, username);
  }

  @Delete(':id')
  public async deleteNoteById(
    @Param('id') noteId: string,
    @User('sub') userId: string,
  ): Promise<UserDocument> {
    return this.noteService.delete(noteId, userId);
  }
}
