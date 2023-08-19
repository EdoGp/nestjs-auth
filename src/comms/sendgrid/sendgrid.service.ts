import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
// import { CustomLogger } from './../../common/logger.service';
import { EmailProperties } from './../interfaces/emailProperties.interface';

@Injectable()
export class SendgridService {
  constructor() {
    // private readonly serviceLogger: CustomLogger
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    } catch (error) {
      // this.serviceLogger.error('Error loading sendgrid credentials', error);
    }
  }
  async sendEmail(emailProperties: EmailProperties) {
    const msg = {
      to: emailProperties.to,
      from: {
        email: emailProperties?.from?.email || 'contact@eduardogonzalez.dev',
        name: emailProperties?.from?.name || 'Contact',
      },
      subject: emailProperties.subject,
      text: emailProperties.text,
      html: emailProperties.html,
    };
    return sgMail.send(msg);
  }
}
