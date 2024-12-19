import { Module } from '@nestjs/common';

import { NowplayingmanController } from './nowplayingman.controller';
import { NowplayingmanService } from './nowplayingman.service';

@Module({
  controllers: [NowplayingmanController],
  providers: [NowplayingmanService],
})
export class NowplayingmanModule {}
