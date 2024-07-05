import { Body, Controller, Get, Param, Patch, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ProfilesService } from './profiles.service';
import { MusicsService } from 'src/musics/musics.service';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { User } from 'src/auth/decorators';
import {
  UpdateAvatarDto,
  UpdateInstrumentsDto,
  UpdateMusicDto,
  UpdateNicknameDto,
  UpdateStatusDto,
} from './profiles.dto';
import { ParsePositiveIntPipe } from 'src/common/pipes';

@ApiTags('Profiles')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('access'))
@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly musicService: MusicsService,
    private readonly instrumentsService: InstrumentsService,
  ) {}

  @ApiOperation({ summary: '프로필 뮤직 검색' })
  @Get('musics')
  async searchMusicsFromDatabase(@Query('q') query: string) {
    return await this.musicService.searchMusicsFromDatabase(query);
  }

  @ApiOperation({ summary: '프로필 뮤직 변경' })
  @Patch('music')
  async updateMusic(@User('id') profileId: number, @Body() updateMusicDto: UpdateMusicDto) {
    await this.profilesService.updateMusic(profileId, updateMusicDto);
  }

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

  @ApiOperation({ summary: '프로필 악기 리스트 조회' })
  @Get('instruments')
  async findInstruments() {
    return await this.instrumentsService.findInstruments();
  }

  @ApiOperation({ summary: '프로필 악기 변경' })
  @Patch('instruments')
  async updateInstruments(@User('id') profileId: number, @Body() updateInstrumentsDto: UpdateInstrumentsDto) {
    await this.profilesService.updateInstruments(profileId, updateInstrumentsDto);
  }
}
