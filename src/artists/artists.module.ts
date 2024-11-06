import { Module } from '@nestjs/common';

import { AwsModule } from 'src/aws/aws.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { ArtistsController } from './artists.controller';
import { ArtistsRepository } from './artists.repository';
import { ArtistsService } from './artists.service';

@Module({
  imports: [PrismaModule, AwsModule],
  controllers: [ArtistsController],
  providers: [ArtistsService, ArtistsRepository],
})
export class ArtistsModule {}
