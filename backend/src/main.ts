import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para conexión con frontend Next.js
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validaciones globales automáticas con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Plataforma de Monitorías Académicas — Universidad Simón Bolívar')
    .setDescription(
      'API REST con Arquitectura Limpia para la gestión, seguimiento y consulta de horas de monitorías académicas (Meta: 54 horas).'
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Servidor ejecutándose en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger disponible en: http://localhost:${port}/api/docs`);
}

bootstrap();
