import {
  Controller,
  Get,
  Inject,
  Param,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { RegisterModel } from './user/register.model';
import { UserDTO } from './user/user.dto';
import { lastValueFrom } from 'rxjs';

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

@Controller('user')
export class UserController {
  constructor(@Inject("API_SERVICE") private client: ClientProxy) {}

  @Get('login')
  async login(@Res() response: Response, @Param() params: UserDTO) {
    const userData: any = await lastValueFrom(
      this.client.send<object, object>(
        "log-in-user", 
        params
      )
    );

    response.cookie('refreshToken', userData.refreshToken, {
      maxAge: THIRTY_DAYS,
      httpOnly: true,
    });

    return userData;
  }

  @Get('register')
  async register(@Res() response: Response, @Param() params: UserDTO) {
    const userData: RegisterModel = await lastValueFrom(
      this.client.send<RegisterModel, object>(
        "register-user", 
        params
      )
    );

    response.cookie('refreshToken', userData.refreshToken, {
      maxAge: THIRTY_DAYS,
      httpOnly: true,
    });
    
    return userData;
  }
}
