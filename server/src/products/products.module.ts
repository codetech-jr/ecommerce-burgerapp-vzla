import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma/prisma.service'; // <--- IMPORTANTE: Revisa que la ruta sea correcta

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService], // <--- AGREGAR AQUÍ
})
export class ProductsModule {}
