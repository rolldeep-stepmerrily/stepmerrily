import { Injectable } from '@nestjs/common';

import { CustomHttpException } from '@@exceptions';

import { CreateManufacturerDto, UpdateManufacturerDto } from './manufacturers.dto';
import { MANUFACTURER_ERRORS } from './manufacturers.exception';
import { ManufacturersRepository } from './manufacturers.repository';

@Injectable()
export class ManufacturersService {
  constructor(private readonly manufacturersRepository: ManufacturersRepository) {}

  async createManufacturer(createManufacturerDto: CreateManufacturerDto) {
    const manufacturer = await this.manufacturersRepository.findManufacturerByName(createManufacturerDto.name);

    if (manufacturer) {
      throw new CustomHttpException(MANUFACTURER_ERRORS.DUPLICATED_MANUFACTURER);
    }

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
      throw new CustomHttpException(MANUFACTURER_ERRORS.MANUFACTURER_NOT_FOUND);
    }

    return await this.manufacturersRepository.updateManufacturer(manufacturerId, updateManufacturerDto);
  }

  async deleteManufacturer(manufacturerId: number) {
    const manufacturer = await this.findManufacturer(manufacturerId);

    if (!manufacturer) {
      throw new CustomHttpException(MANUFACTURER_ERRORS.MANUFACTURER_NOT_FOUND);
    }

    return await this.manufacturersRepository.deleteManufacturer(manufacturerId);
  }
}
