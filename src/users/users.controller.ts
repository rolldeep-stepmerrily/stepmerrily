import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import {
  CertifyEmailDto,
  CheckEmailForSignUpDto,
  CheckNicknameForSignUpDto,
  CheckPhoneNumberForSignUpDto,
  CheckUsernameForSignUpDto,
  CreateUserDto,
  FindUsernameByEmailDto,
  SignInDto,
  UpdatePasswordDto,
  VerifyEmailDto,
} from './users.dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '아이디 중복 확인' })
  @Post('signup/duplication/username')
  async checkUsernameForSignUp(@Body() { username }: CheckUsernameForSignUpDto) {
    return this.usersService.checkUsernameForSignUp(username);
  }

  @ApiOperation({ summary: '이메일 중복 확인' })
  @Post('signup/duplication/email')
  async checkEmailForSignUp(@Body() { email }: CheckEmailForSignUpDto) {
    return this.usersService.checkEmailForSignUp(email);
  }

  @ApiOperation({ summary: '닉네임 중복 확인' })
  @Post('signup/duplication/nickname')
  async checkNicknameForSignUp(@Body() { nickname }: CheckNicknameForSignUpDto) {
    return this.usersService.checkNicknameForSignUp(nickname);
  }

  @ApiOperation({ summary: '전화번호 중복 확인' })
  @Post('signup/duplication/phone')
  async checkPhoneNumberForSignUp(@Body() { phoneNumber }: CheckPhoneNumberForSignUpDto) {
    return this.usersService.checkPhoneNumberForSignUp(phoneNumber);
  }

  @ApiOperation({ summary: '회원 가입 인증코드 전송' })
  @Post('signup/certification/email')
  async certifyEmail(@Body() { email }: CertifyEmailDto) {
    return await this.authService.certifyEmail(email);
  }

  @ApiOperation({ summary: '회원 가입 인증코드 확인' })
  @Post('signup/verification/email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(verifyEmailDto);
  }

  @ApiOperation({ summary: '회원 가입' })
  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  //TODO : 여기부터 다시 refactoring 진행하기. 2024.06.16 23:38
  @ApiOperation({ summary: '아이디 찾기' })
  @Post('find/username')
  async findUsernameByEmail(@Body() findUsernameByEmailDto: FindUsernameByEmailDto) {
    return await this.usersService.findUsernameByEmail(findUsernameByEmailDto);
  }

  @ApiOperation({ summary: '비밀번호 변경' })
  @Put('password')
  async updatePassword(@Body() { email, password }: UpdatePasswordDto) {
    return await this.usersService.updatePassword(email, password);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('sign')
  async signIn(@Body() { username, password }: SignInDto) {
    return await this.authService.signIn(username, password);
  }

  @ApiOperation({ summary: '토큰 재발급' })
  @ApiBearerAuth('refreshToken')
  @UseGuards(AuthGuard('refresh'))
  @Get('access')
  async createAccessToken(@User('id') id: number) {
    return await this.authService.createAccessToken(id);
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('accessToken')
  @UseGuards(AuthGuard('access'))
  @Delete('sign')
  async signOut() {
    return;
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiBearerAuth('accessToken')
  @UseGuards(AuthGuard('access'))
  @Delete()
  async updateDeletedAt(@User('id') id: number) {
    return await this.usersService.updateDeletedAt(id);
  }
}
