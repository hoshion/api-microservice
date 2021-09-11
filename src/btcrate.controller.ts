import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('btcrate')
export class BTCRateController {
  constructor(@Inject("API_SERVICE") private client: ClientProxy) {}

  async onApplicationBootstrap() { await this.client.connect();}

  @Get("btc-rate")
  getBTCRate() {
    return this.client.send<string, string>("get-btc-rate", "");
  }
}
