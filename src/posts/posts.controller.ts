import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Post, UseGuards } from '@nestjs/common';

import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/decorators';
import { CreatePostDto } from './posts.dto';

@ApiTags('Posts')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('access'))
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 2024-06-21여기까지.  테스트 해보기
  @ApiOperation({ summary: '게시물 작성' })
  @Post()
  async createPost(@User('id') userId: number, createPostDto: CreatePostDto) {
    return this.postsService.createPost(userId, createPostDto);
  }
}
