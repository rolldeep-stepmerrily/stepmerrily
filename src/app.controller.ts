import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

const { AWS_CLOUDFRONT_DOMAIN } = process.env;

@ApiExcludeController()
@Controller('/')
export class AppController {
  @Get()
  @Render('index.hbs')
  async renderIndex() {
    return {
      awsCloudDomain: AWS_CLOUDFRONT_DOMAIN,
      instagramId: 'hjhj_9292',
    };
  }
}
