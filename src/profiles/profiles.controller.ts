import { Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ProfilesService } from './profiles.service';
import { User } from 'src/auth/decorators';
import { UpdateNicknameDto } from './profiles.dto';

@ApiTags('Profiles')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('access'))
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: '닉네임 변경' })
  @Patch(':id/nickname')
  async updateNickname(@User('id') profileId: number, updateNicknameDto: UpdateNicknameDto) {
    await this.profilesService.updateNickname(profileId, updateNicknameDto);
  }
}
