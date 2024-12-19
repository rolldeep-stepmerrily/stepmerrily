import { Body, Controller, Get, Inject, Post, Query, Render } from '@nestjs/common';

import { NowplayingmanService } from './nowplayingman.service';

@Controller('nowplayingman')
export class NowplayingmanController {
  constructor(
    private readonly nowplayingmanService: NowplayingmanService,
    @Inject('THREADS_APP_ID') private readonly threadsAppId: string,
    @Inject('THREADS_REDIRECT_URI') private readonly threadsRedirectUri: string,
    @Inject('THREADS_SCOPE') private readonly threadsScope: string,
  ) {}

  @Get('auth')
  @Render('auth')
  async auth() {
    return {
      url: `https://threads.net/oauth/authorize?client_id=${this.threadsAppId}&redirect_uri=${this.threadsRedirectUri}&scope=${this.threadsScope}&response_type=code`,
    };
  }

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
