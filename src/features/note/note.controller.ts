import {
  Controller,
  Post,
  UseGuards,
  Body,
  Delete,
  Param,
  Get,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Message, User } from 'src/core/decorators';
import { NoteService } from './note.service';
import { AccessTokenGuard } from 'src/core/guards';
import { ApiTags } from '@nestjs/swagger';
import { CreateNotepadDto } from './dto/create-notepad.dto';
import { NoteDocument } from './note.schema';
import { UserDocument } from '../user/user.schema';
import { UpdateNoteDto } from './dto/update-notepad.dto';
import { ObjectIdPipeValidation } from 'src/core/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'nestjs-cloudinary';

@Controller()
@UseGuards(AccessTokenGuard)
@ApiTags('Notes')
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
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
    @Param('id', new ObjectIdPipeValidation()) noteId: string,
    @User('sub', new ObjectIdPipeValidation()) userId: string,
  ): Promise<UserDocument> {
    return this.noteService.deleteNotepadById(noteId, userId);
  }

  @Get(':id')
  @Message('Successfully fetched the note')
  public async findNoteById(
    @Param('id', new ObjectIdPipeValidation()) noteId: string,
    @User('sub', new ObjectIdPipeValidation()) userId: string,
  ): Promise<NoteDocument> {
    return this.noteService.findNoteById(noteId, userId);
  }

  @Put(':id')
  @Message('Successfully updated the note')
  public async updateNoteById(
    @Param('id', new ObjectIdPipeValidation()) noteId: string,
    @User('sub', new ObjectIdPipeValidation()) userId: string,
    @Body() updateDto: UpdateNoteDto,
  ): Promise<NoteDocument> {
    return this.noteService.updateNoteById(noteId, userId, updateDto);
  }

  @Post('upload')
  @Message('Successfully uploaded the file')
  @UseInterceptors(FileInterceptor)
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file, {
      allowed_formats: ['pdf'],
      format: 'pdf',
    });
  }
}
