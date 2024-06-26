import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { ClassificationsModule } from 'src/classifications/classifications.module';
import { ManufacturersModule } from 'src/manufacturers/manufacturers.module';
import { InstrumentsController } from './instruments.controller';
import { InstrumentsService } from './instruments.service';
import { InstrumentsRepository } from './instruments.repository';

@Module({
  imports: [PrismaModule, ClassificationsModule, ManufacturersModule],
  controllers: [InstrumentsController],
  providers: [InstrumentsService, InstrumentsRepository],
})
export class InstrumentsModule {}
