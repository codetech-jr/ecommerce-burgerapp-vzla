import { IsString, IsNumber, IsOptional, Min, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0) // Precio no puede ser negativo
  price: number;

  @IsString()
  image: string;

  @IsString()
  category: string;

  @IsString()
  slug: string; // Lo estamos generando en frontend

  @IsString()
  @IsOptional()
  prepTime?: string;

  @IsString()
  @IsOptional()
  ingredients?: string;
}
