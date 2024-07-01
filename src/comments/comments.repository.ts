import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './comments.dto';
import dayjs from 'dayjs';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createComment(userId: number, createCommentDto: CreateCommentDto) {
    try {
      return await this.prismaService.comment.create({
        data: { profileId: userId, ...createCommentDto },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findComment(commentId: number) {
    try {
      return await this.prismaService.comment.findUnique({
        where: { id: commentId, deletedAt: null },
        select: { id: true, profileId: true, commentId: true, likes: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async unlikeComment(likeId: number) {
    try {
      return await this.prismaService.like.update({
        where: { id: likeId },
        data: { deletedAt: dayjs().toISOString() },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async likeComment(userId: number, commentId: number) {
    try {
      return await this.prismaService.like.create({
        data: { profileId: userId, commentId },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateComment(commentId: number, { content }: UpdateCommentDto) {
    try {
      return await this.prismaService.comment.update({
        where: { id: commentId },
        data: { content },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deleteComment(commentId: number) {
    try {
      return await this.prismaService.comment.update({
        where: { id: commentId },
        data: { deletedAt: dayjs().toISOString() },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
