import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CommentsRepository } from './comments.repository';
import { PostsRepository } from 'src/posts/posts.repository';
import { CreateCommentDto, UpdateCommentDto } from './comments.dto';

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

  async likeComment(userId: number, commentId: number) {
    const comment = await this.commentsRepository.findComment(commentId);

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const like = comment.likes.find((like) => like.userId === userId);

    if (like) {
      return this.commentsRepository.unlikeComment(like.id);
    }

    return this.commentsRepository.likeComment(userId, commentId);
  }

  async updateComment(userId: number, commentId: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentsRepository.findComment(commentId);

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.user.id !== userId) {
      throw new BadRequestException('댓글 작성자만 수정할 수 있습니다.');
    }

    return this.commentsRepository.updateComment(commentId, updateCommentDto);
  }

  async deleteComment(userId: number, commentId: number) {
    const comment = await this.commentsRepository.findComment(commentId);

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.user.id !== userId) {
      throw new BadRequestException('댓글 작성자만 삭제할 수 있습니다.');
    }

    return this.commentsRepository.deleteComment(commentId);
  }
}
