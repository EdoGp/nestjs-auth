import { Injectable } from '@nestjs/common';
// import { CustomLogger } from './../common/logger.service';
import { EmailProperties } from './interfaces/emailProperties.interface';
import { SendgridService } from './sendgrid/sendgrid.service';

@Injectable()
export class CommsService {
  constructor(
    private readonly sendGridService: SendgridService, // private readonly serviceLogger: CustomLogger,
  ) {
    // this.serviceLogger.log('Communications service');
  }
  sendMail(emailProperties: EmailProperties) {
    // console.log('SendingEmail', { emailProperties });
    this.sendGridService.sendEmail(emailProperties);
  }
}
