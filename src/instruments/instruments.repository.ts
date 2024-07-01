import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInstrumentDto, UpdateInstrumentDto } from './instruments.dto';
import dayjs from 'dayjs';

@Injectable()
export class InstrumentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createInstrument(createInstrumentDto: CreateInstrumentDto) {
    try {
      return await this.prismaService.instrument.create({ data: createInstrumentDto, select: { id: true } });
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

  async findInstrumentBySerialNumber(serialNumber: string) {
    try {
      return await this.prismaService.instrument.findUnique({
        where: {
          serialNumber,
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

  async updateInstrument(instrumentId: number, updateInstrumentDto: UpdateInstrumentDto) {
    try {
      return await this.prismaService.instrument.update({
        where: { id: instrumentId },
        data: updateInstrumentDto,
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deleteInstrument(instrumentId: number) {
    try {
      return await this.prismaService.instrument.update({
        where: { id: instrumentId },
        data: { deletedAt: dayjs().toISOString() },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
