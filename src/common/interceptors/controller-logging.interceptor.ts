import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {CustomLogger} from './../logger.service';

@Injectable()
export class ControllerLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, body, params, query, url, cookies } =
      context.getArgByIndex(0);
    const { statusCode } = context.getArgByIndex(1);
    this.logger.verbose(
      `[INC][${method}] ${url}
      ${
        // cookies && Object.keys(cookies).length ? ' [COOKIES][✓]' : ''
      }
      ${Object.keys(body).length ? ` [BODY] ${JSON.stringify(body)}` : ''}${
        Object.keys(params).length ? ` [PARAMS] ${JSON.stringify(params)}` : ''
      }${Object.keys(query).length ? ` [QUERY] ${JSON.stringify(query)}` : ''}`,
    );
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.verbose(
            `[OUT][${method}][${statusCode}] ${url}  +${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
