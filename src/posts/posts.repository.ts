import { Injectable, InternalServerErrorException } from '@nestjs/common';
import dayjs from 'dayjs';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './posts.dto';

@Injectable()
export class PostsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(userId: number, createPostDto: CreatePostDto) {
    try {
      return await this.prismaService.post.create({
        data: { profileId: userId, ...createPostDto },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findLastPost() {
    try {
      return await this.prismaService.post.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findPosts(postId?: number) {
    try {
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
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findPostId(postId: number) {
    try {
      return await this.prismaService.post.findUnique({
        where: { id: postId, deletedAt: null },
        select: { id: true, likes: { select: { id: true, profileId: true }, where: { deletedAt: null } } },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findPost(postId: number) {
    try {
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
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async unlikePost(likeId: number) {
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

  async likePost(userId: number, postId: number) {
    try {
      return await this.prismaService.like.create({
        data: { profileId: userId, postId },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updatePost(postId: number, updatePostDto: CreatePostDto) {
    try {
      return await this.prismaService.post.update({
        where: { id: postId, deletedAt: null },
        data: updatePostDto,
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deletePost(postId: number) {
    try {
      return await this.prismaService.post.update({
        where: { id: postId, deletedAt: null },
        data: { deletedAt: dayjs().toISOString() },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
