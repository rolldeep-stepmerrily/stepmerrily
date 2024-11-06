import { Module } from '@nestjs/common';

import { AwsModule } from 'src/aws/aws.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { AlbumsController } from './albums.controller';
import { AlbumsRepository } from './albums.repository';
import { AlbumsService } from './albums.service';

@Module({
  imports: [PrismaModule, AwsModule],
  controllers: [AlbumsController],
  providers: [AlbumsService, AlbumsRepository],
})
export class AlbumsModule {}
