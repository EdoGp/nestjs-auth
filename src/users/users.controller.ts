import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommonQueryDTO } from './../common/dtos/common-query.dto';
import { ParseObjectIdPipePipe } from './../common/pipes/parse-object-id-pipe.pipe';
import { ActiveUser } from './../iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from './../iam/interfaces/active-user-data.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createOneOrMany(createUserDto);
  }

  @Get()
  async findAll(
    @ActiveUser() user: ActiveUserData,
    @Query() commonQuery: CommonQueryDTO<User>,
  ) {
    const {
      select: { password, __v, ...select } = {},
      sort,
      s,
      limit = 20,
      page = 1,
      offset: skip,
    } = commonQuery;
    const items: User[] = await this.usersService.findMany(
      s,
      Object.keys(select).length ? select : { password: 0, __v: 0 },
      { sort, limit, skip: skip + limit * (page - 1) },
    );
    const count: number = await this.usersService.countMany({});
    return { items, count };
  }

  @Get(':id')
  findOne(@Param('id', new ParseObjectIdPipePipe()) _id: string) {
    return this.usersService.findOne({ _id }, { password: 0, __v: 0, _id: 0 });
  }

  @Put(':id')
  update(
    @Param('id', new ParseObjectIdPipePipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateOneById(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseObjectIdPipePipe()) id: string) {
    return this.usersService.deleteById(id);
  }
}
