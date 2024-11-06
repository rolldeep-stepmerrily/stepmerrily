import { BadRequestException, Injectable } from '@nestjs/common';

import { CustomHttpException } from '@@exceptions';

import { PostsRepository } from 'src/posts/posts.repository';

import { CreateCommentDto, UpdateCommentDto } from './comments.dto';
import { COMMENT_ERRORS } from './comments.exception';
import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createComment(userId: number, createCommentDto: CreateCommentDto) {
    const post = await this.postsRepository.findPost(createCommentDto.postId);

    if (!post) {
      throw new CustomHttpException(COMMENT_ERRORS.POST_NOT_FOUND);
    }

    if (createCommentDto.commentId) {
      const comment = await this.commentsRepository.findComment(createCommentDto.commentId);

      if (!comment) {
        throw new CustomHttpException(COMMENT_ERRORS.COMMENT_NOT_FOUND);
      }

      if (comment?.commentId) {
        throw new CustomHttpException(COMMENT_ERRORS.INVALID_COMMENT);
      }
    }

    return await this.commentsRepository.createComment(userId, createCommentDto);
  }

  async findComment(commentId: number) {
    return await this.commentsRepository.findComment(commentId);
  }

  async likeComment(userId: number, commentId: number) {
    const comment = await this.commentsRepository.findComment(commentId);

    if (!comment) {
      throw new CustomHttpException(COMMENT_ERRORS.COMMENT_NOT_FOUND);
    }

    const like = comment.likes.find((like) => like.profileId === userId);

    if (like) {
      return await this.commentsRepository.unlikeComment(like.id);
    }

    return await this.commentsRepository.likeComment(userId, commentId);
  }

  async updateComment(userId: number, commentId: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findComment(commentId);

    if (!comment) {
      throw new CustomHttpException(COMMENT_ERRORS.COMMENT_NOT_FOUND);
    }

    if (comment.profileId !== userId) {
      throw new CustomHttpException(COMMENT_ERRORS.INVALID_USER);
    }

    return await this.commentsRepository.updateComment(commentId, updateCommentDto);
  }

  async deleteComment(userId: number, commentId: number) {
    const comment = await this.findComment(commentId);

    if (!comment) {
      throw new CustomHttpException(COMMENT_ERRORS.COMMENT_NOT_FOUND);
    }

    if (comment.profileId !== userId) {
      throw new CustomHttpException(COMMENT_ERRORS.INVALID_USER);
    }

    return await this.commentsRepository.deleteComment(commentId);
  }
}
