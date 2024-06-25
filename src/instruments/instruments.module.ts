import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { InstrumentsController } from './instruments.controller';
import { InstrumentsService } from './instruments.service';
import { InstrumentsRepository } from './instruments.repository';

@Module({
  imports: [PrismaModule],
  controllers: [InstrumentsController],
  providers: [InstrumentsService, InstrumentsRepository],
})
export class InstrumentsModule {}
