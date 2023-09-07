import {
  Controller,
  Post,
  UseGuards,
  Body,
  Delete,
  Param,
  Get,
  Put,
} from '@nestjs/common';
import { Message, User } from 'src/core/decorators';
import { NoteService } from './note.service';
import { AccessTokenGuard } from 'src/core/guards';
import { ApiTags } from '@nestjs/swagger';
import { CreateNotepadDto } from './dto/create-notepad.dto';
import { NoteDocument } from './note.schema';
import { UserDocument } from '../user/user.schema';
import { UpdateNoteDto } from './dto/update-notepad.dto';

@Controller()
@UseGuards(AccessTokenGuard)
@ApiTags('Notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('create')
  @Message('Sucessfully created the note')
  public async createNote(
    @Body() createNotepadDto: CreateNotepadDto,
    @User('username') username: string,
  ): Promise<NoteDocument> {
    return this.noteService.create(createNotepadDto, username);
  }

  @Delete(':id')
  @Message('Sucessfully deleted the note')
  public async deleteNoteById(
    @Param('id') noteId: string,
    @User('sub') userId: string,
  ): Promise<UserDocument> {
    return this.noteService.deleteNotepadById(noteId, userId);
  }

  @Get(':id')
  @Message('Successfully fetched the note')
  public async findNoteById(
    @Param('id') noteId: string,
    @User('sub') userId: string,
  ): Promise<NoteDocument> {
    return this.noteService.findNoteById(noteId, userId);
  }

  @Put(':id/update')
  @Message('Successfully updated the note')
  public async updateNoteById(
    @Param('id') noteId: string,
    @User('sub') userId: string,
    @Body() updateDto: UpdateNoteDto,
  ): Promise<NoteDocument> {
    return this.noteService.updateNoteById(noteId, userId, updateDto);
  }
}
