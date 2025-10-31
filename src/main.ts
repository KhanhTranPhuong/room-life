import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Enable global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Enable CORS
  app.enableCors();
  
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();