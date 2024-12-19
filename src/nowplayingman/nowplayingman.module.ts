import { Module } from '@nestjs/common';

import { AwsModule } from 'src/aws/aws.module';

import { NowplayingmanController } from './nowplayingman.controller';
import { NowplayingmanService } from './nowplayingman.service';

@Module({
  imports: [AwsModule],
  controllers: [NowplayingmanController],
  providers: [NowplayingmanService],
})
export class NowplayingmanModule {}
