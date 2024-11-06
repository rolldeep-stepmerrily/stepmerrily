import { Module } from '@nestjs/common';

import { AwsModule } from 'src/aws/aws.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { PlaylistsController } from './playlists.controller';
import { PlaylistsRepository } from './playlists.repository';
import { PlaylistsService } from './playlists.service';

@Module({
  imports: [PrismaModule, AwsModule],
  controllers: [PlaylistsController],
  providers: [PlaylistsService, PlaylistsRepository],
})
export class PlaylistsModule {}
