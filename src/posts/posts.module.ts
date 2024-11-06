import { Module } from '@nestjs/common';

import { AwsModule } from 'src/aws/aws.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

@Module({
  imports: [PrismaModule, AwsModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsRepository],
})
export class PostsModule {}
