import { Module } from '@nestjs/common';

import { PostsModule } from 'src/posts/posts.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';

@Module({
  imports: [PrismaModule, PostsModule],
  providers: [CommentsService, CommentsRepository],
  controllers: [CommentsController],
})
export class CommentsModule {}
