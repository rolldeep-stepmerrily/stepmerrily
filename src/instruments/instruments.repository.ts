import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateInstrumentDto, UpdateInstrumentDto } from './instruments.dto';

@Injectable()
@CatchDatabaseErrors()
export class InstrumentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createInstrument(createInstrumentDto: CreateInstrumentDto) {
    return await this.prismaService.instrument.create({ data: createInstrumentDto, select: { id: true } });
  }

  async findInstruments() {
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
  }

  async findInstrumentsByIds(instrumentIds: number[]) {
    return await this.prismaService.instrument.findMany({
      where: {
        id: { in: instrumentIds },
        deletedAt: null,
        minorClassification: { deletedAt: null },
        manufacturer: { deletedAt: null },
      },
      select: { id: true },
    });
  }

  async findInstrument(instrumentId: number) {
    return await this.prismaService.instrument.findUnique({
      where: {
        id: instrumentId,
        deletedAt: null,
        minorClassification: { deletedAt: null },
        manufacturer: { deletedAt: null },
      },
      select: { id: true },
    });
  }

  async findInstrumentBySerialNumber(serialNumber: string) {
    return await this.prismaService.instrument.findUnique({
      where: {
        serialNumber,
        deletedAt: null,
        minorClassification: { deletedAt: null },
        manufacturer: { deletedAt: null },
      },
      select: { id: true },
    });
  }

  async updateInstrument(instrumentId: number, updateInstrumentDto: UpdateInstrumentDto) {
    return await this.prismaService.instrument.update({
      where: { id: instrumentId },
      data: updateInstrumentDto,
      select: { id: true },
    });
  }

  async deleteInstrument(instrumentId: number) {
    return await this.prismaService.instrument.update({
      where: { id: instrumentId },
      data: { deletedAt: dayjs().toISOString() },
      select: { id: true },
    });
  }
}
