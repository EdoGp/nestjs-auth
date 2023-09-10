import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommsModule } from './comms/comms.module';

import { IamModule } from './iam/iam.module';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    IamModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
    CommsModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
