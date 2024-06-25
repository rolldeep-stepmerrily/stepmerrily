import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ClassificationsService } from './classifications.service';

@ApiTags('Classifications')
@Controller('classifications')
export class ClassificationsController {
  constructor(private readonly classificationsService: ClassificationsService) {}
}
