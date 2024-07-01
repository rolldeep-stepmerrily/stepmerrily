import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { AwsModule } from 'src/aws/aws.module';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { ArtistsRepository } from './artists.repository';

@Module({
  imports: [PrismaModule, AwsModule],
  controllers: [ArtistsController],
  providers: [ArtistsService, ArtistsRepository],
})
export class ArtistsModule {}
