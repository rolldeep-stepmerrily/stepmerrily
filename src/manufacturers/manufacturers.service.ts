import { BadRequestException, Injectable } from '@nestjs/common';

import { ManufacturersRepository } from './manufacturers.repository';
import { CreateManufacturerDto, UpdateManufacturerDto } from './manufacturers.dto';

@Injectable()
export class ManufacturersService {
  constructor(private readonly manufacturersRepository: ManufacturersRepository) {}

  async createManufacturer(createManufacturerDto: CreateManufacturerDto) {
    return await this.manufacturersRepository.createManufacturer(createManufacturerDto);
  }

  async findManufacturers() {
    const manufacturers = await this.manufacturersRepository.findManufacturers();

    return { manufacturers };
  }

  async findManufacturer(manufacturerId: number) {
    return await this.manufacturersRepository.findManufacturer(manufacturerId);
  }

  async updateManufacturer(manufacturerId: number, updateManufacturerDto: UpdateManufacturerDto) {
    const manufacturer = await this.findManufacturer(manufacturerId);

    if (!manufacturer) {
      throw new BadRequestException('제조사가 존재하지 않습니다.');
    }

    return await this.manufacturersRepository.updateManufacturer(manufacturerId, updateManufacturerDto);
  }

  async deleteManufacturer(manufacturerId: number) {
    const manufacturer = await this.findManufacturer(manufacturerId);

    if (!manufacturer) {
      throw new BadRequestException('제조사가 존재하지 않습니다.');
    }

    return await this.manufacturersRepository.deleteManufacturer(manufacturerId);
  }
}
