import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

import { Post } from './entities/post.entity';

export class CreatePostDto extends PickType(Post, ['title', 'content', 'images'] as const) {}

export class CreatePostImagesDto extends Array<Express.Multer.File> {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    description: '게시글 이미지 (최대 10개)',
    required: false,
  })
  images?: Express.Multer.File[];
}

export class CreatePostWithImagesDto extends IntersectionType(CreatePostDto, CreatePostImagesDto) {}
