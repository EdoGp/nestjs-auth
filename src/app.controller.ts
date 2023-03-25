import { Controller, Get, Options } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth } from './iam/authentication/decorators/auth.decorator';
import { AuthType } from './iam/authentication/enums/auth-type.enum';
@Auth(AuthType.None)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus(): object {
    return this.appService.getStatus();
  }

  @Options('/*')
  options(): object {
    return this.appService.getStatus();
  }
}
