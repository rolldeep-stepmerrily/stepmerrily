import { Module } from '@nestjs/common';

import { AwsModule } from 'src/aws/aws.module';
import { InstrumentsModule } from 'src/instruments/instruments.module';
import { MusicsModule } from 'src/musics/musics.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { ProfilesController } from './profiles.controller';
import { ProfilesRepository } from './profiles.repository';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [PrismaModule, AwsModule, MusicsModule, InstrumentsModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfilesRepository],
})
export class ProfilesModule {}
