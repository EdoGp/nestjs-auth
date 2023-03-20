import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomLogger } from './../logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const { method, body, params, query, url, cookies } = host.getArgByIndex(0);
    this.logger.verbose(
      `[INC][${method}] ${url}${
        Object.keys(cookies).length ? ' [COOKIES][✓]' : ''
      }${Object.keys(body).length ? ` [BODY] ${JSON.stringify(body)}` : ''}${
        Object.keys(params).length ? ` [PARAMS] ${JSON.stringify(params)}` : ''
      }${Object.keys(query).length ? ` [QUERY] ${JSON.stringify(query)}` : ''}`,
    );
    const now = Date.now();
    this.logger.verbose(
      `[OUT][${method}][${exception.getStatus()}] ${url}  +${
        Date.now() - now
      }ms`,
    );
    response
      .status(status)
      .json({ statusCode: exception.getStatus(), message: exception.message });
  }
}
