import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NextFunction, Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject("API_SERVICE") private client: ClientProxy,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) throw createException();

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) throw createException();

    const isAccessTokenValid = await lastValueFrom(this.client.send<boolean, string>("check-access-token", accessToken));
    if (!isAccessTokenValid) throw createException();
    
    next();
  }
}

function createException(): HttpException {
  return new HttpException('User is not authorized', HttpStatus.UNAUTHORIZED);
}
