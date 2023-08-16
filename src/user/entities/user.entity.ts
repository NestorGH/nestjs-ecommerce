import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

/*
  @Prop()
  roles: Role[];
*/
}

export const UserSchema = SchemaFactory.createForClass(User)