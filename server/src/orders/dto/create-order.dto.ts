import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  MinLength,
  IsEmail,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @MinLength(2) // El nombre debe tener al menos 2 letras
  customerName: string;

  @IsString()
  @MinLength(8) // Un teléfono debe ser largo
  phone: string;

  @IsString()
  address: string;

  @IsNumber()
  @Min(0.01) // No permitimos órdenes de $0 o negativas
  total: number;

  @IsArray()
  items: any[];

  @IsString()
  paymentMethod: string;

  @IsString()
  @IsOptional() // Es opcional porque en 'Efectivo' puede no haber referencia
  paymentRef?: string;
}
