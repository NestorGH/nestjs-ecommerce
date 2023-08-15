import { IsOptional, IsString, Min } from "class-validator";

export class FilterProductDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;
}