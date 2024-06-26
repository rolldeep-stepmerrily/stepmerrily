import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { ClassificationsController } from './classifications.controller';
import { ClassificationsService } from './classifications.service';
import { ClassificationsRepository } from './classifications.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ClassificationsController],
  providers: [ClassificationsService, ClassificationsRepository],
  exports: [ClassificationsService],
})
export class ClassificationsModule {}
