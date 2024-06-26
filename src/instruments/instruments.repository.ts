import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInstrumentDto } from './instruments.dto';

@Injectable()
export class InstrumentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createInstrument(createInstrumentDto: CreateInstrumentDto) {
    try {
      return await this.prismaService.instrument.create({
        data: createInstrumentDto,
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findInstruments() {
    try {
      return await this.prismaService.instrument.findMany({
        where: { deletedAt: null, minorClassification: { deletedAt: null }, manufacturer: { deletedAt: null } },
        orderBy: { id: 'asc' },
        select: {
          id: true,
          name: true,
          serialNumber: true,
          minorClassification: { select: { id: true, name: true } },
          manufacturer: { select: { id: true, name: true } },
        },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findInstrument(instrumentId: number) {
    try {
      return await this.prismaService.instrument.findUnique({
        where: {
          id: instrumentId,
          deletedAt: null,
          minorClassification: { deletedAt: null },
          manufacturer: { deletedAt: null },
        },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
