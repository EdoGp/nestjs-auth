import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { HashingService } from './hashing.service';

@Injectable()
export class Argon2Service implements HashingService {
  async hash(data: string | Buffer): Promise<string> {
    return hash(data);
  }
  compare(data: string, encrypted: string): Promise<boolean> {
    return verify(data, encrypted);
  }
}
