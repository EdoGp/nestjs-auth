import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/Filters/httpException.filter';
import { ControllerLoggingInterceptor } from './common/interceptors/controller-logging.interceptor';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

import { CustomLogger } from './common/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter(new CustomLogger()));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new ControllerLoggingInterceptor(new CustomLogger()),
  );
  const corsURLs = process.env.BASE_URL.split(',')
    .map((url) => [url.trim(), url.trim() + '/'])
    .flat();
  app.enableCors({
    origin: corsURLs,
    credentials: true,
  });
  app.use(helmet());
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
