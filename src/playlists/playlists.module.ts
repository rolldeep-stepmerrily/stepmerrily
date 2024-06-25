import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import { PlaylistsRepository } from './playlists.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PlaylistsController],
  providers: [PlaylistsService, PlaylistsRepository],
})
export class PlaylistsModule {}
