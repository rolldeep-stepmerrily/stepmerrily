import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('/')
export class AppController {
  @Get()
  @Render('index.hbs')
  async renderIndex() {
    return {
      instagramId: 'hjhj_9292',
    };
  }
}
