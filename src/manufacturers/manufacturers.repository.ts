import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateManufacturerDto, UpdateManufacturerDto } from './manufacturers.dto';

@Injectable()
@CatchDatabaseErrors()
export class ManufacturersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createManufacturer(createManufacturerDto: CreateManufacturerDto) {
    return await this.prismaService.manufacturer.create({ data: createManufacturerDto, select: { id: true } });
  }

  async findManufacturers() {
    return await this.prismaService.manufacturer.findMany({
      where: { deletedAt: null },
      orderBy: { id: 'asc' },
      select: { id: true, name: true },
    });
  }

  async findManufacturer(manufacturerId: number) {
    return await this.prismaService.manufacturer.findUnique({
      where: { id: manufacturerId, deletedAt: null },
      select: { id: true },
    });
  }

  async findManufacturerByName(name: string) {
    return await this.prismaService.manufacturer.findUnique({
      where: { name, deletedAt: null },
      select: { id: true },
    });
  }

  async updateManufacturer(manufacturerId: number, { name }: UpdateManufacturerDto) {
    return await this.prismaService.manufacturer.update({
      where: { id: manufacturerId },
      data: { name },
      select: { id: true },
    });
  }

  async deleteManufacturer(manufacturerId: number) {
    return await this.prismaService.manufacturer.update({
      where: { id: manufacturerId },
      data: { deletedAt: dayjs().toISOString() },
      select: { id: true },
    });
  }
}
