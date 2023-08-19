import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';

export class InvalidatedRefreshTokenError extends Error {}

const DAY_IN_SECONDS = 60 * 60 * 24;

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST_URL || 'localhost',
      port: Number(process.env.REDIS_HOST_PORT) || 6379,
      username: process.env.REDIS_USERNAME || '',
      password: process.env.REDIS_PASSWORD || '',
    });
  }
  onApplicationShutdown(signal?: string) {
    this.redisClient.quit();
  }

  async insert(
    userId: string,
    tokenId: string,
    ttl = Number(process.env.JWT_REFRESH_TOKEN_TTL || DAY_IN_SECONDS),
  ): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
    const keys = await this.redisClient.keys('*');
    // console.log('keys', keys);
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this.getKey(userId));
    if (storedId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storedId === tokenId;
  }

  async invalidate(userId: string): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  async getValue(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  private getKey(userId: string): string {
    return `user-${userId}`;
  }
}
