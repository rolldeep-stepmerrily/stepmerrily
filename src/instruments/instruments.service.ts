import { Injectable } from '@nestjs/common';

import { CustomHttpException } from '@@exceptions';

import { ClassificationsService } from 'src/classifications/classifications.service';
import { ManufacturersService } from 'src/manufacturers/manufacturers.service';

import { CreateInstrumentDto } from './instruments.dto';
import { INSTRUMENT_ERRORS } from './instruments.exception';
import { InstrumentsRepository } from './instruments.repository';

@Injectable()
export class InstrumentsService {
  constructor(
    private readonly instrumentsRepository: InstrumentsRepository,
    private readonly classificationService: ClassificationsService,
    private readonly manufacturerService: ManufacturersService,
  ) {}

  async createInstrument({ name, serialNumber, minorClassificationId, manufacturerId }: CreateInstrumentDto) {
    if (serialNumber) {
      const instrument = await this.instrumentsRepository.findInstrumentBySerialNumber(serialNumber);

      if (instrument) {
        throw new CustomHttpException(INSTRUMENT_ERRORS.DUPLICATED_SERIAL_NUMBER);
      }
    }

    const minorClassification = await this.classificationService.findMinorClassification(minorClassificationId);

    if (!minorClassification) {
      throw new CustomHttpException(INSTRUMENT_ERRORS.MINOR_CLASSIFICATION_NOT_FOUND);
    }

    const manufacturer = await this.manufacturerService.findManufacturer(manufacturerId);

    if (!manufacturer) {
      throw new CustomHttpException(INSTRUMENT_ERRORS.MANUFACTURER_NOT_FOUND);
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

  async findInstrumentsByIds(instrumentIds: number[]) {
    return await this.instrumentsRepository.findInstrumentsByIds(instrumentIds);
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
      throw new CustomHttpException(INSTRUMENT_ERRORS.INSTRUMENT_NOT_FOUND);
    }

    const minorClassification = await this.classificationService.findMinorClassification(minorClassificationId);

    if (!minorClassification) {
      throw new CustomHttpException(INSTRUMENT_ERRORS.MINOR_CLASSIFICATION_NOT_FOUND);
    }

    const manufacturer = await this.manufacturerService.findManufacturer(manufacturerId);

    if (!manufacturer) {
      throw new CustomHttpException(INSTRUMENT_ERRORS.MANUFACTURER_NOT_FOUND);
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
      throw new CustomHttpException(INSTRUMENT_ERRORS.INSTRUMENT_NOT_FOUND);
    }

    return await this.instrumentsRepository.deleteInstrument(instrumentId);
  }
}
