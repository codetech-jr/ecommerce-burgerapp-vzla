import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ProductsModule, OrdersModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
