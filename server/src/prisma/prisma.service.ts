import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // <--- 1. Asegúrate de importar esto

@Injectable()
// 2. ¡ESTA LÍNEA ES LA CLAVE! Tiene que decir "extends PrismaClient"
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.$connect();
  }
}
