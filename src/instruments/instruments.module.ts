import { Module } from '@nestjs/common';

import { ClassificationsModule } from 'src/classifications/classifications.module';
import { ManufacturersModule } from 'src/manufacturers/manufacturers.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { InstrumentsController } from './instruments.controller';
import { InstrumentsRepository } from './instruments.repository';
import { InstrumentsService } from './instruments.service';

@Module({
  imports: [PrismaModule, ClassificationsModule, ManufacturersModule],
  controllers: [InstrumentsController],
  providers: [InstrumentsService, InstrumentsRepository],
  exports: [InstrumentsService],
})
export class InstrumentsModule {}
