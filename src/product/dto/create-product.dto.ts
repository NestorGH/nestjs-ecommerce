import { IsNumber, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @MinLength(1)
  category: string;
}
