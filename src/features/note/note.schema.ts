import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    minlength: 3,
  })
  public title: string;

  @Prop({ type: User, required: true, trim: true, ref: 'User' })
  public author: User;

  @Prop({ type: String, required: true, maxlength: 30000 }) //30kb
  public content: String;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
