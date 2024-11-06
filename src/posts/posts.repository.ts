import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreatePostDto } from './posts.dto';

@Injectable()
@CatchDatabaseErrors()
export class PostsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(userId: number, createPostDto: CreatePostDto) {
    return await this.prismaService.post.create({
      data: { profileId: userId, ...createPostDto },
      select: { id: true },
    });
  }

  async findLastPost() {
    return await this.prismaService.post.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true },
    });
  }

  async findPosts(postId?: number) {
    return await this.prismaService.post.findMany({
      where: { deletedAt: null },
      take: 21,
      skip: postId ? 1 : 0,
      ...(postId && { cursor: { id: postId } }),
      select: {
        id: true,
        title: true,
        views: true,
        createdAt: true,
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { id: 'desc' },
    });
  }

  async findPostId(postId: number) {
    return await this.prismaService.post.findUnique({
      where: { id: postId, deletedAt: null },
      select: { id: true, likes: { select: { id: true, profileId: true }, where: { deletedAt: null } } },
    });
  }

  async findPost(postId: number) {
    return await this.prismaService.post.update({
      where: { id: postId, deletedAt: null },
      data: { views: { increment: 1 } },
      select: {
        id: true,
        profile: { select: { id: true, avatar: true, nickname: true } },
        title: true,
        content: true,
        images: true,
        views: true,
        comments: {
          select: {
            id: true,
            profile: { select: { id: true, avatar: true, nickname: true } },
            content: true,
            createdAt: true,
            deletedAt: true,
            reComments: {
              select: {
                id: true,
                profile: { select: { id: true, avatar: true, nickname: true } },
                content: true,
                createdAt: true,
                deletedAt: true,
                _count: {
                  select: { likes: { where: { deletedAt: null } } },
                },
              },
            },
            _count: {
              select: { likes: { where: { deletedAt: null } } },
            },
          },
          where: { commentId: null },
          orderBy: { id: 'desc' },
        },
        createdAt: true,
        _count: {
          select: { likes: { where: { deletedAt: null } } },
        },
      },
    });
  }

  async unlikePost(likeId: number) {
    return await this.prismaService.like.update({
      where: { id: likeId },
      data: { deletedAt: dayjs().toISOString() },
      select: { id: true },
    });
  }

  async likePost(userId: number, postId: number) {
    return await this.prismaService.like.create({
      data: { profileId: userId, postId },
      select: { id: true },
    });
  }

  async updatePost(postId: number, updatePostDto: CreatePostDto) {
    return await this.prismaService.post.update({
      where: { id: postId, deletedAt: null },
      data: updatePostDto,
      select: { id: true },
    });
  }

  async deletePost(postId: number) {
    return await this.prismaService.post.update({
      where: { id: postId, deletedAt: null },
      data: { deletedAt: dayjs().toISOString() },
      select: { id: true },
    });
  }
}
