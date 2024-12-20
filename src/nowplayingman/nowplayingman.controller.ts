import { Body, Controller, Get, Post, Query, Render, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { NowplayingmanService } from './nowplayingman.service';

@Controller('nowplayingman')
export class NowplayingmanController {
  constructor(private readonly nowplayingmanService: NowplayingmanService) {}

  @Get('auth')
  async auth(@Res() res: any) {
    const url = await this.nowplayingmanService.getAuthUrl();

    return res.redirect(url);
  }

  @Get('redirect')
  async redirect(@Query() query: any, @Res() res: any) {
    const code = query.code;

    const token = await this.nowplayingmanService.getToken(code);

    return res.redirect(`/nowplayingman/view?token=${token}`);
  }

  @Post('cancel')
  async cancel(@Body() body: any) {
    console.log(body);
  }

  @Post('delete')
  async deletes(@Body() deletes: any) {
    console.log(deletes);
  }

  @Get('view')
  @Render('view')
  async view() {
    return {};
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.nowplayingmanService.processImage(file);
  }
}
