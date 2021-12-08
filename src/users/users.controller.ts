import { Controller, Get } from '@nestjs/common';
import { ListUsersResult } from 'firebase-admin/auth';
import { UsersService } from './users.service';

@Controller('secure/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/list')
  getHello(): Promise<ListUsersResult> {
    return this.usersService.getUsers();
  }
}
