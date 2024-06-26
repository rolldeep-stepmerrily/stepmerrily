import { Module, forwardRef } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { AwsModule } from 'src/aws/aws.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), AwsModule, ProfilesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
