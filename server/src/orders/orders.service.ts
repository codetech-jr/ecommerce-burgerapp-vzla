/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Asegúrate que la ruta sea correcta

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // 1. CREAR LA ORDEN REAL
  async create(data: any) {
    return await this.prisma.order.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        address: data.address || 'Retiro en local',
        total: data.total,
        paymentMethod: data.paymentMethod,
        items: data.items, // El carrito en JSON

        // LO NUEVO:
        paymentRef: data.paymentRef || 'N/A', // Si no envían ref, pone N/A
        status: 'PENDIENTE_VERIFICACION',
      },
    });
  }

  // 2. VER TODAS (Para cuando hagamos el panel de cocina)
  async findAll() {
    return await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. OBTENER UNA ORDEN POR ID
  async findOne(id: number) {
    return await this.prisma.order.findUnique({
      where: { id },
    });
  }

  // 4. ACTUALIZAR UNA ORDEN (especialmente el status)
  async update(id: number, updateOrderDto: any) {
    return await this.prisma.order.update({
      where: { id },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        status: updateOrderDto.status as string,
        // Puedes agregar más campos aquí si necesitas actualizar otros datos
      },
    });
  }

  // 5. ELIMINAR UNA ORDEN
  async remove(id: number) {
    return await this.prisma.order.delete({
      where: { id },
    });
  }
}
