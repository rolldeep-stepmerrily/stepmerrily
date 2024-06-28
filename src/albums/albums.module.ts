import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { AwsModule } from 'src/aws/aws.module';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { AlbumsRepository } from './albums.repository';

@Module({
  imports: [PrismaModule, AwsModule],
  controllers: [AlbumsController],
  providers: [AlbumsService, AlbumsRepository],
})
export class AlbumsModule {}
