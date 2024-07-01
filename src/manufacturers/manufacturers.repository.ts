import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateManufacturerDto, UpdateManufacturerDto } from './manufacturers.dto';
import dayjs from 'dayjs';

@Injectable()
export class ManufacturersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createManufacturer(createManufacturerDto: CreateManufacturerDto) {
    try {
      return await this.prismaService.manufacturer.create({ data: createManufacturerDto, select: { id: true } });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findManufacturers() {
    try {
      return await this.prismaService.manufacturer.findMany({
        where: { deletedAt: null },
        orderBy: { id: 'asc' },
        select: { id: true, name: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findManufacturer(manufacturerId: number) {
    try {
      return await this.prismaService.manufacturer.findUnique({
        where: { id: manufacturerId, deletedAt: null },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findManufacturerByName(name: string) {
    try {
      return await this.prismaService.manufacturer.findUnique({
        where: { name, deletedAt: null },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateManufacturer(manufacturerId: number, { name }: UpdateManufacturerDto) {
    try {
      return await this.prismaService.manufacturer.update({
        where: { id: manufacturerId },
        data: { name },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deleteManufacturer(manufacturerId: number) {
    try {
      return await this.prismaService.manufacturer.update({
        where: { id: manufacturerId },
        data: { deletedAt: dayjs().toISOString() },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
