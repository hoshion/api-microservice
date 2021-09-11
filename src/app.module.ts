import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BTCRateController } from './btcrate.controller';
import { UserController } from './user.controller';
import * as env from 'dotenv';
import { AuthMiddleware } from './middlewares/auth.middleware';

env.config();

@Module({
  imports: [
    ClientsModule.register([{
      name: "API_SERVICE",
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
        queue: process.env.RABBITMQ_QUEUE_NAME,
        queueOptions: {
          durable: false
        },
      }
    }
  ])],
  controllers: [BTCRateController, UserController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/btcRate');
  }
}
