import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ClassificationsService } from './classifications.service';

@ApiTags('Classifications')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('admin'))
@Controller('classifications')
export class ClassificationsController {
  constructor(private readonly classificationsService: ClassificationsService) {}
}
