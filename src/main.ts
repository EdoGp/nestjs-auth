import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  // app.use(helmet());
  const options = new DocumentBuilder()
    .setTitle('Basic Nestjs CRUD API')
    .setDescription('Basic nestjs CRUD API with users and authentication')
    .setVersion(process.env.version || '0.1.1beta')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);
  await app.listen(3000);
}
bootstrap();
