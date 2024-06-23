import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';

import { PostsService } from './posts.service';
import { User } from 'src/auth/decorators';
import { CreatePostDto, CreatePostImagesDto, CreatePostWithImagesDto, FindPostsDto } from './posts.dto';
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

  @ApiOperation({ summary: '게시물 리스트 조회' })
  @Get()
  async findPosts(@Query() findPostsDto: FindPostsDto) {
    return await this.postsService.findPosts(findPostsDto);
  }

  @ApiOperation({ summary: '게시물 조회' })
  @Get(':id')
  async findPost(@Param('id', ParsePositiveIntPipe) postId: number) {
    return await this.postsService.findPost(postId);
  }

  @ApiOperation({ summary: '게시물 추천' })
  @Patch(':id/like')
  async likePost(@User('id') userId: number, @Param('id', ParsePositiveIntPipe) postId: number) {
    return await this.postsService.likePost(userId, postId);
  }

  //게시물 삭제, 수정 API 추가
}
