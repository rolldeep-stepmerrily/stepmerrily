import { PickType } from '@nestjs/swagger';

import { Instrument } from './entities';

export class CreateInstrumentDto extends PickType(Instrument, [
  'name',
  'serialNumber',
  'minorClassificationId',
  'manufacturerId',
] as const) {}

export class UpdateInstrumentDto extends PickType(Instrument, [
  'name',
  'serialNumber',
  'minorClassificationId',
  'manufacturerId',
] as const) {}
