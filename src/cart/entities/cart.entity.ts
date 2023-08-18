import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";
import { Item } from "./item.entity";
import { User } from "src/user/entities/user.entity";

@Schema()
export class Cart {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name }) //TODO: Add ref to 'User'
  userId: string;

  @Prop()
  items: Item[];

  @Prop()
  totalPrice: number; 
}

export const CartSchema = SchemaFactory.createForClass(Cart);