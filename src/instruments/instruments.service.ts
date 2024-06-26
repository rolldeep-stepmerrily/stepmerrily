import { BadRequestException, Injectable } from '@nestjs/common';

import { InstrumentsRepository } from './instruments.repository';
import { ClassificationsService } from 'src/classifications/classifications.service';
import { ManufacturersService } from 'src/manufacturers/manufacturers.service';
import { CreateInstrumentDto } from './instruments.dto';

@Injectable()
export class InstrumentsService {
  constructor(
    private readonly instrumentsRepository: InstrumentsRepository,
    private readonly classificationService: ClassificationsService,
    private readonly manufacturerService: ManufacturersService,
  ) {}

  async createInstrument({ name, serialNumber, minorClassificationId, manufacturerId }: CreateInstrumentDto) {
    const minorClassification = await this.classificationService.findMinorClassification(minorClassificationId);

    if (!minorClassification) {
      throw new BadRequestException('소분류가 존재하지 않습니다.');
    }

    const manufacturer = await this.manufacturerService.findManufacturer(manufacturerId);

    if (!manufacturer) {
      throw new BadRequestException('제조사가 존재하지 않습니다.');
    }

    return await this.instrumentsRepository.createInstrument({
      name,
      serialNumber,
      minorClassificationId,
      manufacturerId,
    });
  }

  async findInstruments() {
    const instruments = await this.instrumentsRepository.findInstruments();

    return { instruments };
  }

  async findInstrument(instrumentId: number) {
    return await this.instrumentsRepository.findInstrument(instrumentId);
  }

  async updateInstrument(
    instrumentId: number,
    { name, serialNumber, minorClassificationId, manufacturerId }: CreateInstrumentDto,
  ) {
    const instrument = await this.findInstrument(instrumentId);

    if (!instrument) {
      throw new BadRequestException('악기가 존재하지 않습니다.');
    }

    const minorClassification = await this.classificationService.findMinorClassification(minorClassificationId);

    if (!minorClassification) {
      throw new BadRequestException('소분류가 존재하지 않습니다.');
    }

    const manufacturer = await this.manufacturerService.findManufacturer(manufacturerId);

    if (!manufacturer) {
      throw new BadRequestException('제조사가 존재하지 않습니다.');
    }

    return await this.instrumentsRepository.updateInstrument(instrumentId, {
      name,
      serialNumber,
      minorClassificationId,
      manufacturerId,
    });
  }

  async deleteInstrument(instrumentId: number) {
    const instrument = await this.findInstrument(instrumentId);

    if (!instrument) {
      throw new BadRequestException('악기가 존재하지 않습니다.');
    }

    return await this.instrumentsRepository.deleteInstrument(instrumentId);
  }
}
