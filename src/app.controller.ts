import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseAuthGuard } from './firebase/firebase.guard';
import { UserPayload } from './firebase/firebase.middleware';
import { User } from './users/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/secure/ping')
  async securePing(@User() user: UserPayload): Promise<string> {
    console.log(user);
    return 'pong';
  }

  @Get('/test')
  @UseGuards(FirebaseAuthGuard)
  async guardTest(@User('email') email: string): Promise<string> {
    return email;
  }
}
