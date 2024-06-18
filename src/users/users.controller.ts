import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import {
  CheckEmailForSignUpDto,
  CheckNicknameForSignUpDto,
  CheckPhoneNumberForSignUpDto,
  CheckUsernameForSignUpDto,
  CreateUserDto,
  FindUsernameByEmailDto,
  SignInDto,
  UpdatePasswordDto,
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

  @ApiOperation({ summary: '회원가입 아이디 중복 확인' })
  @Post('signup/duplication/username')
  async checkUsernameForSignUp(@Body() checkUsernameForSignUpDto: CheckUsernameForSignUpDto) {
    return this.usersService.checkUsernameForSignUp(checkUsernameForSignUpDto);
  }

  @ApiOperation({ summary: '회원가입 이메일 중복 확인' })
  @Post('signup/duplication/email')
  async checkEmailForSignUp(@Body() checkEmailForSignUpDto: CheckEmailForSignUpDto) {
    return this.usersService.checkEmailForSignUp(checkEmailForSignUpDto);
  }

  @ApiOperation({ summary: '회원가입 닉네임 중복 확인' })
  @Post('signup/duplication/nickname')
  async checkNicknameForSignUp(@Body() checkNicknameForSignUpDto: CheckNicknameForSignUpDto) {
    return this.usersService.checkNicknameForSignUp(checkNicknameForSignUpDto);
  }

  @ApiOperation({ summary: '회원가입 전화번호 중복 확인' })
  @Post('signup/duplication/phone')
  async checkPhoneNumberForSignUp(@Body() checkPhoneNumberForSignUpDto: CheckPhoneNumberForSignUpDto) {
    return this.usersService.checkPhoneNumberForSignUp(checkPhoneNumberForSignUpDto);
  }

  @ApiOperation({ summary: '회원 가입' })
  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: '아이디 찾기' })
  @Post('account/username')
  async findUsernameByEmail(@Body() findUsernameByEmailDto: FindUsernameByEmailDto) {
    return await this.usersService.findUsernameByEmail(findUsernameByEmailDto);
  }

  @ApiOperation({ summary: '비밀번호 변경' })
  @Put('account/password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return await this.usersService.updatePassword(updatePasswordDto);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('signin')
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
  @Delete('signout')
  async signOut() {
    return;
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiBearerAuth('accessToken')
  @UseGuards(AuthGuard('access'))
  @Delete('withdrawal')
  async deleteUser(@User('id') id: number) {
    return await this.usersService.deleteUser(id);
  }
}
