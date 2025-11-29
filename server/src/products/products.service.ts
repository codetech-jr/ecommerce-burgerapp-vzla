import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service'; // Asegúrate de importar tu PrismaService correctamente

@Injectable()
export class ProductsService {
  // Inyectamos el servicio de base de datos
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput) {
    return await this.prisma.product.create({
      data: data,
    });
  }

  async findAll() {
    return await this.prisma.product.findMany({
      orderBy: { id: 'desc' }, // Para que los nuevos salgan arriba
    });
  }

  async findOne(id: number) {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  // Tu método especial para slugs
  async findOneBySlug(slug: string) {
    return await this.prisma.product.findFirst({
      where: { slug },
    });
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    return await this.prisma.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    return await this.prisma.product.delete({
      where: { id },
    });
  }
}
