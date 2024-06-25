import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { InstrumentsService } from './instruments.service';

@ApiTags('Instruments')
@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}
}
