import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';

import { PostsService } from './posts.service';
import { User } from 'src/auth/decorators';
import { CreatePostDto, CreatePostImagesDto, CreatePostWithImagesDto } from './posts.dto';
import { ParsePositiveIntPipe } from 'src/common/pipes';

@ApiTags('Posts')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('access'))
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '게시물 작성' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePostWithImagesDto })
  @UseInterceptors(FilesInterceptor('images', 10))
  @Post()
  async createPost(
    @User('id') userId: number,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() createPostImagesDto: CreatePostImagesDto,
  ) {
    await this.postsService.createPost(userId, createPostDto, createPostImagesDto);
  }

  @ApiOperation({ summary: '게시물 조회' })
  @Get(':id')
  async findPost(@Param('id', ParsePositiveIntPipe) postId: number) {
    return await this.postsService.findPost(postId);
  }
}
