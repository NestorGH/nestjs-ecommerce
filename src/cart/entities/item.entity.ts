import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Document } from "mongoose";
import { Product } from "src/product/entities/product.entity";

@Schema()
export class Item extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: Product.name }) //TODO: Add ref to 'Product'
  productId: string;

  @Prop()
  name: string;

  @Prop()
  quantity: number;

  @Prop()
  price: number;

  @Prop()
  subTotalPrice: number; 
}

export const ItemSchema = SchemaFactory.createForClass(Item);