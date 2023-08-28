import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import randomString from 'randomstring';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, type: String, trim: true })
  public username: string;

  @Prop({
    unique: true,
    type: String,
    trim: true,
    match: [/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/, 'Please enter a valid email'],
    required: [true, 'This field must be filled with by email'],
  })
  public email: string;

  @Prop({
    type: String,
    trim: true,
  })
  public password: string;

  @Prop({ type: Types.ObjectId, default: [], ref: 'User' })
  public notes: Types.ObjectId[];

  //Deprecated!!!
  //Keeping this property only for project's stability.
  @Prop()
  public refreshToken: string;

  //Will be using session token instead of storing refreshToken in the database.
  @Prop({ type: String })
  public sessionToken: string;

  public generateSessionToken(): void {
    this.sessionToken = randomString.generate({
      length: 60,
      charset: 'alphabetic',
    });
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
