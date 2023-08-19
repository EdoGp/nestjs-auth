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
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CommsService } from './../../comms/comms.service';
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
  constructor(
    private readonly authService: AuthenticationService,
    private readonly commsService: CommsService,
  ) {}

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

  @Auth(AuthType.None)
  @Post('password-recovery')
  async passwordRecovery(@Body() { email }: { email: string }) {
    const recoveryToken = await this.authService.passwordRecovery(email);
    this.commsService.sendMail({
      to: email,
      subject: 'Password Recovery Request',
      html: `
      <div>
      <p> Hi,</p>
      <p>
      We received a request to reset your password for your account at [redacted].
      </p>
      <p>
      If you did not request this password reset, please disregard this email.
      </p>
      <p>
      To reset your password, please click on the following link:
      <a href="http://localhost:3000/auth/password-reset?token=${recoveryToken}">Reset password</a>
      </p>
      <p>
      This link will expire in 24 hours.
      </p>
      <p>
      Thank you
      </p>
</div>`,
    });
    return;
  }

  @Auth(AuthType.None)
  @Post('password-reset')
  async passwordReset(
    @Body() { password, token }: { password: string; token: string },
  ) {
    return this.authService.passwordReset(token, password);
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
