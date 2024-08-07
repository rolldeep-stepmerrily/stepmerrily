import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { MailerModule } from '@nestjs-modules/mailer';

import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, AdminStrategy, RefreshTokenStrategy } from './strategies';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule,
    HttpModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.daum.net',
          port: 465,
          auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD },
        },
        defaults: { from: `stepmerrily <rolldeep@stepmerrily.com>` },
      }),
    }),
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, AdminStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
