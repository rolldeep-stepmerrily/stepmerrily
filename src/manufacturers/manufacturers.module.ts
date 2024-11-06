import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { ManufacturersController } from './manufacturers.controller';
import { ManufacturersRepository } from './manufacturers.repository';
import { ManufacturersService } from './manufacturers.service';

@Module({
  imports: [PrismaModule],
  controllers: [ManufacturersController],
  providers: [ManufacturersService, ManufacturersRepository],
  exports: [ManufacturersService],
})
export class ManufacturersModule {}
