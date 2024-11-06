import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { ClassificationsController } from './classifications.controller';
import { ClassificationsRepository } from './classifications.repository';
import { ClassificationsService } from './classifications.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClassificationsController],
  providers: [ClassificationsService, ClassificationsRepository],
  exports: [ClassificationsService],
})
export class ClassificationsModule {}
