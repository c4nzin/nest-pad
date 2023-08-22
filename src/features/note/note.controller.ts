import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  Delete,
  Param,
} from '@nestjs/common';
import { Message } from 'src/core/decorators';
import { NoteService } from './note.service';
import { AccessTokenGuard } from 'src/core/guards';
import { ApiTags } from '@nestjs/swagger';
import { CreateNotepadDto } from './dto/create-notepad.dto';
import { NoteDocument } from './note.schema';
import { Request } from 'express';
import { UserDocument } from '../user/user.schema';

@Controller()
@ApiTags('Notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  //Needs to be improved with decorator issue link : https://github.com/canmertinyo/memo-pal/issues/46
  @Post('create')
  @Message('Sucessfully created note')
  @UseGuards(AccessTokenGuard)
  public async createNote(
    @Body() createNotepadDto: CreateNotepadDto,
    @Req() req: Request,
  ): Promise<NoteDocument> {
    const currentUsername = req.user['username'];
    return this.noteService.create(createNotepadDto, currentUsername);
  }

  //Needs to be improved with decorator issue link : https://github.com/canmertinyo/memo-pal/issues/46
  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  public async deleteById(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<UserDocument | NoteDocument> {
    const currentUserId = req.user['sub'];
    return this.noteService.delete(id, currentUserId);
  }
}
