import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <--- ESTO ES EL TRUCO MAGICO
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <--- ESTO PERMITE QUE OTROS LO USEN
})
export class PrismaModule {}
