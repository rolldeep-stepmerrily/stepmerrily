import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CommentsRepository } from './comments.repository';
import { PostsRepository } from 'src/posts/posts.repository';
import { CreateCommentDto } from './comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createComment(userId: number, createCommentDto: CreateCommentDto) {
    const post = await this.postsRepository.findPost(createCommentDto.postId);

    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    if (createCommentDto.commentId) {
      const comment = await this.commentsRepository.findComment(createCommentDto.commentId);

      if (!comment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      if (comment?.commentId) {
        throw new BadRequestException('대댓글에 대한 대댓글은 달 수 없습니다.');
      }
    }

    return this.commentsRepository.createComment(userId, createCommentDto);
  }
}
