import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  #startTime;
  constructor() {
    this.#startTime = new Date().toISOString();
  }

  getStatus(): object {
    return {
      status: 'alive',
      startTime: this.#startTime,
      message: `Server alive since ${this.#startTime}`,
    };
  }
}
