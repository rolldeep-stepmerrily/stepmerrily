import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { MusicsController } from './musics.controller';
import { MusicsService } from './musics.service';

@Module({
  imports: [PrismaModule],
  controllers: [MusicsController],
  providers: [MusicsService],
})
export class MusicsModule {}
