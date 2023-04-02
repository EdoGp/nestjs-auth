import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from './../../config/jwt.config';
import { REQUEST_USER_KEY } from './../../iam.constants';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const cookies = request.headers.cookie?.split(';') ?? [];
    const refreshTokenCookie = cookies.find((cookie) => {
      return cookie.trim().startsWith('refreshToken=');
    });
    const refreshToken = refreshTokenCookie?.split('=')[1];
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    console.log({ refreshToken, token, refreshTokenCookie });
    return refreshToken || token;
  }
}
