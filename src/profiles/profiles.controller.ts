import { Body, Controller, Get, Param, Patch, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ProfilesService } from './profiles.service';
import { User } from 'src/auth/decorators';
import { UpdateAvatarDto, UpdateNicknameDto, UpdateStatusDto } from './profiles.dto';
import { ParsePositiveIntPipe } from 'src/common/pipes';

@ApiTags('Profiles')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('access'))
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: '프로필 조회' })
  @Get(':id')
  async findProfileDetail(@Param('id', ParsePositiveIntPipe) profileId: number) {
    return await this.profilesService.findProfileDetail(profileId);
  }

  @ApiOperation({ summary: '닉네임 변경' })
  @Patch('nickname')
  async updateNickname(@User('id') profileId: number, @Body() updateNicknameDto: UpdateNicknameDto) {
    await this.profilesService.updateNickname(profileId, updateNicknameDto);
  }

  @ApiOperation({ summary: '아바타 변경' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAvatarDto })
  @UseInterceptors(FilesInterceptor('avatar', 1))
  @Patch('avatar')
  async updateAvatar(@User('id') profileId: number, @UploadedFiles() updateAvatarDto: UpdateAvatarDto) {
    await this.profilesService.updateAvatar(profileId, updateAvatarDto);
  }

  @ApiOperation({ summary: '상태 메시지 변경' })
  @Patch('status')
  async updateStatus(@User('id') profileId: number, @Body() updateStatusDto: UpdateStatusDto) {
    await this.profilesService.updateStatus(profileId, updateStatusDto);
  }
}
