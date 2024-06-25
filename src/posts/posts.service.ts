import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PostsRepository } from './posts.repository';
import { AwsService } from 'src/aws/aws.service';
import { CreatePostDto, CreatePostImagesDto, FindPostsDto, UpdatePostDto, UpdatePostImagesDto } from './posts.dto';

const { AWS_CLOUDFRONT_DOMAIN } = process.env;

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly awsService: AwsService,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDto, createPostImagesDto: CreatePostImagesDto) {
    if (createPostImagesDto.length > 0) {
      const lastPost = await this.postsRepository.findLastPost();

      const lastPostId = lastPost?.id ?? 0;

      const uploadPath = `users/${userId}/posts/${lastPostId + 1}`;

      await this.awsService.uploadImages(createPostImagesDto, uploadPath);

      return this.postsRepository.createPost(userId, { ...createPostDto, images: uploadPath });
    }

    return this.postsRepository.createPost(userId, createPostDto);
  }

  async findPosts({ postId }: FindPostsDto) {
    const posts = await this.postsRepository.findPosts(postId);

    return { posts };
  }

  async findPost(postId: number) {
    const post = await this.postsRepository.findPost(postId);

    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    const comments = post.comments.map((comment) => {
      if (comment.deletedAt) {
        comment.content = '삭제된 댓글입니다.';
      }

      return comment;
    });

    const findImages = post.images ? await this.awsService.findImages(post.images) : null;

    const images = findImages?.map((image) => `${AWS_CLOUDFRONT_DOMAIN}/${image.Key}`) ?? null;

    return { post: { ...post, comments }, images };
  }

  async likePost(userId: number, postId: number) {
    const post = await this.postsRepository.findPostId(postId);

    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    const like = post.likes.find((like) => like.userId === userId);

    if (like) {
      return this.postsRepository.unlikePost(like.id);
    }

    return this.postsRepository.likePost(userId, postId);
  }

  async updatePost(
    userId: number,
    postId: number,
    updatePostDto: UpdatePostDto,
    updatePostImagesDto: UpdatePostImagesDto,
  ) {
    const post = await this.postsRepository.findPost(postId);

    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    if (post.user.id !== userId) {
      throw new BadRequestException('게시물 작성자만 수정할 수 있습니다.');
    }

    if (updatePostImagesDto.length > 0) {
      const uploadPath = `users/${userId}/posts/${postId}`;

      await this.awsService.deleteImages(uploadPath);

      await this.awsService.uploadImages(updatePostImagesDto, uploadPath);

      return this.postsRepository.updatePost(post.id, { ...updatePostDto, images: uploadPath });
    }

    const images = post.images;

    return this.postsRepository.updatePost(post.id, { ...updatePostDto, images });
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.postsRepository.findPost(postId);

    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    if (post.user.id !== userId) {
      throw new BadRequestException('게시물 작성자만 삭제할 수 있습니다.');
    }

    if (post.images) {
      await this.awsService.deleteImages(post.images);
    }

    return this.postsRepository.deletePost(post.id);
  }
}
