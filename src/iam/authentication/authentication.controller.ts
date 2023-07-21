import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ActiveUserData } from './../interfaces/active-user-data.interface';
import { AuthenticationService } from './authentication.service';
import { ActiveUser } from './decorators/active-user.decorator';
import { Auth } from './decorators/auth.decorator';
import { Cookies } from './decorators/cookies';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthType } from './enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    const responseTokens = await this.authService.signIn(signInDto);
    // this.authService.setCookieTokens(response, responseTokens);
    return responseTokens;
  }

  @Auth(AuthType.Bearer)
  @Get('/me')
  async profile(@ActiveUser() { sub: userId }: ActiveUserData) {
    return this.authService.getProfile(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Cookies('refreshToken') refreshTokenCookie: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken: RefreshTokenDto = refreshTokenDto.refreshToken
      ? refreshTokenDto
      : {
          refreshToken: refreshTokenCookie,
        };
    const responseTokens = await this.authService.refreshTokens(refreshToken);
    // this.authService.setCookieTokens(response, responseTokens);
    return responseTokens;
  }
}
