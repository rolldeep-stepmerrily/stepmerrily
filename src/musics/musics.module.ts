import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { MusicsController } from './musics.controller';
import { MusicsRepository } from './musics.repository';
import { MusicsService } from './musics.service';

@Module({
  imports: [PrismaModule],
  controllers: [MusicsController],
  providers: [MusicsService, MusicsRepository],
  exports: [MusicsService],
})
export class MusicsModule {}
