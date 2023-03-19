import { Logger } from '@nestjs/common';

export class CustomLogger extends Logger {
  log(message: string) {
    super.log(message);
    /* your implementation */
  }
  error(message: string, trace: string) {
    super.error(message, trace);
    /* your implementation */
  }
  warn(message: string) {
    super.warn(message);
    /* your implementation */
  }
  debug(message: string) {
    super.debug(message);
    /* your implementation */
  }
  verbose(message: string) {
    super.verbose(message);
    /* your implementation */
  }
}
