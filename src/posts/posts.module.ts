import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
