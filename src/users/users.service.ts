import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './../common/common.service';
import { CustomLogger } from './../common/logger.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends Service<User> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super(new CustomLogger(UsersService.name), userModel);
  }
}
