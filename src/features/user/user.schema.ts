import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({ unique: true, type: String, trim: true, maxlength: 15, minlength: 3 })
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
    maxlength: 15,
    minlength: 3,
    select: false,
  })
  public password: string;

  @Prop({ type: Types.ObjectId, default: [], ref: 'User' })
  public notes: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  return next();
});
