import { ApiProperty } from '@nestjs/swagger';
import { Comment as CommentModel } from '@prisma/client';
import { IsDate, IsOptional, IsPositive, IsString } from 'class-validator';

export class Comment implements CommentModel {
  @ApiProperty({ description: 'ID', minimum: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '유저 ID', minimum: 1, required: true })
  @IsPositive()
  userId: number;

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

  @ApiProperty({ description: 'created at' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'updated at' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ description: 'deleted at' })
  @IsDate()
  deletedAt: Date | null;
}
