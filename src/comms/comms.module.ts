import { Module } from '@nestjs/common';
import { CommsService } from './comms.service';
import { SendgridService } from './sendgrid/sendgrid.service';

@Module({
  providers: [SendgridService, CommsService],
  exports: [SendgridService, CommsService],
})
export class CommsModule {}
