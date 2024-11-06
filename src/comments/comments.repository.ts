import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateCommentDto, UpdateCommentDto } from './comments.dto';

@Injectable()
@CatchDatabaseErrors()
export class CommentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createComment(userId: number, createCommentDto: CreateCommentDto) {
    return await this.prismaService.comment.create({
      data: { profileId: userId, ...createCommentDto },
      select: { id: true },
    });
  }

  async findComment(commentId: number) {
    return await this.prismaService.comment.findUnique({
      where: { id: commentId, deletedAt: null },
      select: { id: true, profileId: true, commentId: true, likes: true },
    });
  }

  async unlikeComment(likeId: number) {
    return await this.prismaService.like.update({
      where: { id: likeId },
      data: { deletedAt: dayjs().toISOString() },
      select: { id: true },
    });
  }

  async likeComment(userId: number, commentId: number) {
    return await this.prismaService.like.create({ data: { profileId: userId, commentId }, select: { id: true } });
  }

  async updateComment(commentId: number, { content }: UpdateCommentDto) {
    return await this.prismaService.comment.update({
      where: { id: commentId },
      data: { content },
      select: { id: true },
    });
  }

  async deleteComment(commentId: number) {
    return await this.prismaService.comment.update({
      where: { id: commentId },
      data: { deletedAt: dayjs().toISOString() },
      select: { id: true },
    });
  }
}
