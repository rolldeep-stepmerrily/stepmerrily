import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';

import { UsersModule } from 'src/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, AdminStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule,
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const user = configService.getOrThrow<string>('EMAIL_ADDRESS');
        const pass = configService.getOrThrow<string>('EMAIL_PASSWORD');

        return {
          transport: { host: 'smtp.daum.net', port: 465, auth: { user, pass } },
          defaults: { from: `stepmerrily <rolldeep@stepmerrily.com>` },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, AdminStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
