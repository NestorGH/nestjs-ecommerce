import { IsNumber, IsPositive, IsString, MinLength } from "class-validator";

export class ItemDTO {

  productId: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}