import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { NowplayingmanService } from './nowplayingman.service';

@Controller('nowplayingman')
export class NowplayingmanController {
  constructor(private readonly nowplayingmanService: NowplayingmanService) {}

  @Get('redirect')
  async redirect(@Query() query: any) {
    console.log(query);
  }

  @Post('cancel')
  async cancel(@Body() body: any) {
    console.log(body);
  }

  @Post('delete')
  async deletes(@Body() deletes: any) {
    console.log(deletes);
  }
}
