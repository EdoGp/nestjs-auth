import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
// import Redis from 'ioredis';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  // private redisClient: Redis;

  onApplicationBootstrap() {
    // this.redisClient = new Redis({ host: 'localhost', port: 6379 });
  }
  onApplicationShutdown(signal?: string) {
    // this.redisClient.quit();
    // throw new Error('Method not implemented.');
  }

  async insert(userId: string, tokenId: string): Promise<void> {
    // await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    // const storedId = await this.redisClient.get(this.getKey(userId));
    // if (storedId !== tokenId) {
    //   throw new InvalidatedRefreshTokenError();
    // }
    // return storedId === tokenId;
    return true;
  }

  async invalidate(userId: string): Promise<void> {
    // await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: string): string {
    return `user-${userId}`;
  }
}
