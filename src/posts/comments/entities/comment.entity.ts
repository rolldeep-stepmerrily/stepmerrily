import { ApiProperty } from '@nestjs/swagger';
import { Comment as CommentModel } from '@prisma/client';
import { IsOptional, IsPositive, IsString } from 'class-validator';

import { Common } from 'src/common/entities';

export class Comment extends Common implements CommentModel {
  @ApiProperty({ description: 'ID', minimum: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '유저 ID', minimum: 1, required: true })
  @IsPositive()
  profileId: number;

  @ApiProperty({ description: '게시물 ID', minimum: 1, required: true, example: 1 })
  @IsPositive()
  postId: number;

  @ApiProperty({ description: '부모 댓글 ID', minimum: 1, required: false, example: null, nullable: true })
  @IsOptional()
  @IsPositive()
  commentId: number | null;

  @ApiProperty({ description: '내용', required: true, example: '내용' })
  @IsString()
  content: string;
}
