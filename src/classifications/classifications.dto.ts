import { PickType } from '@nestjs/swagger';

import { Classification } from './entities';

export class CreateClassificationDto extends PickType(Classification, ['name'] as const) {}

export class UpdateClassificationDto extends PickType(Classification, ['name'] as const) {}
