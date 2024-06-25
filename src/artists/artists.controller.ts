import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ArtistsService } from './artists.service';

@ApiTags('Artists')
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}
}
