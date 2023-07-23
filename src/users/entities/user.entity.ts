import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  passwordConfirmation: string;

  @Prop()
  firstName: string;

  @Prop()
  isEmailConfirmed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
