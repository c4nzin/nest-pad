import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './note.schema';
import { UserModule } from '../user/user.module';
import { NoteRepository } from './repositories/note.repositories';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    UserModule,
  ],
  controllers: [NoteController],
  providers: [NoteService, NoteRepository],
  exports: [NoteService],
})
export class NoteModule {}
