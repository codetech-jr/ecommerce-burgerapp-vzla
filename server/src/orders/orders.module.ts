import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // <--- 1. IMPÓRTALO AQUÍ

@Module({
  imports: [PrismaModule], // <--- 2. AGRÉGALO AQUI EN IMPORTS
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
