import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CertifyEmailDto, VerifyEmailDto } from 'src/users/users.dto';

import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '이메일 인증코드 전송' })
  @Post('certification')
  async certifyEmail(@Body() certifyEmailDto: CertifyEmailDto) {
    return await this.authService.certifyEmail(certifyEmailDto);
  }

  @ApiOperation({ summary: '이메일 인증코드 확인' })
  @Post('verification')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(verifyEmailDto);
  }
}
