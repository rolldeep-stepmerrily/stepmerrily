import { PickType } from '@nestjs/swagger';

import { Profile } from './entities';

export class UpdateNicknameDto extends PickType(Profile, ['nickname'] as const) {}
