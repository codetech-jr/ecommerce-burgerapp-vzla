import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 CONFIGURACIÓN CORS "MODO AMIGABLE" 🔥
  app.enableCors({
    origin: true, // <--- ESTO. Ni array, ni string. Solo TRUE.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Aplicación corriendo en puerto: ${port}`); // Asegura el 0.0.0.0 aquí también por si acaso
}
bootstrap();
