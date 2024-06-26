import { PickType } from '@nestjs/swagger';

import { Manufacturer } from './entities';

export class CreateManufacturerDto extends PickType(Manufacturer, ['name'] as const) {}

export class UpdateManufacturerDto extends PickType(Manufacturer, ['name'] as const) {}
