import { Inject, Injectable } from '@nestjs/common';

import { CustomHttpException } from '@@exceptions';

import { AwsService } from 'src/aws/aws.service';

import { CreatePostDto, CreatePostImagesDto, FindPostsDto, UpdatePostDto, UpdatePostImagesDto } from './posts.dto';
import { POST_ERRORS } from './posts.entity';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly awsService: AwsService,
    @Inject('AWS_CLOUDFRONT_DOMAIN') private readonly awsCloudfrontDomain: string,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDto, createPostImagesDto: CreatePostImagesDto) {
    if (createPostImagesDto.length > 0) {
      const lastPost = await this.postsRepository.findLastPost();

      const lastPostId = lastPost?.id ?? 0;

      const uploadPath = `users/${userId}/posts/${lastPostId + 1}`;

      await this.awsService.uploadImages(createPostImagesDto, uploadPath);

      return await this.postsRepository.createPost(userId, { ...createPostDto, images: uploadPath });
    }

    return await this.postsRepository.createPost(userId, createPostDto);
  }

  async findPosts({ postId }: FindPostsDto) {
    const posts = await this.postsRepository.findPosts(postId);

    return { posts };
  }

  async findPost(postId: number) {
    const post = await this.postsRepository.findPost(postId);

    if (!post) {
      throw new CustomHttpException(POST_ERRORS.POST_NOT_FOUND);
    }

    const comments = post.comments.map((comment) => {
      if (comment.deletedAt) {
        comment.content = '삭제된 댓글입니다.';
      }

      return comment;
    });

    const findImages = post.images ? await this.awsService.findImages(post.images) : null;

    const images = findImages?.map((image) => `${this.awsCloudfrontDomain}/${image.Key}`) ?? null;

    return { post: { ...post, comments }, images };
  }

  async likePost(userId: number, postId: number) {
    const post = await this.postsRepository.findPostId(postId);

    if (!post) {
      throw new CustomHttpException(POST_ERRORS.POST_NOT_FOUND);
    }

    const like = post.likes.find((like) => like.profileId === userId);

    if (like) {
      return await this.postsRepository.unlikePost(like.id);
    }

    return await this.postsRepository.likePost(userId, postId);
  }

  async updatePost(
    userId: number,
    postId: number,
    updatePostDto: UpdatePostDto,
    updatePostImagesDto: UpdatePostImagesDto,
  ) {
    const post = await this.postsRepository.findPost(postId);

    if (!post) {
      throw new CustomHttpException(POST_ERRORS.POST_NOT_FOUND);
    }

    if (post.profile.id !== userId) {
      throw new CustomHttpException(POST_ERRORS.INVALID_USER);
    }

    if (updatePostImagesDto.length > 0) {
      const uploadPath = `users/${userId}/posts/${postId}`;

      await this.awsService.deleteImages(uploadPath);

      await this.awsService.uploadImages(updatePostImagesDto, uploadPath);

      return await this.postsRepository.updatePost(post.id, { ...updatePostDto, images: uploadPath });
    }

    const images = post.images;

    return await this.postsRepository.updatePost(post.id, { ...updatePostDto, images });
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.postsRepository.findPost(postId);

    if (!post) {
      throw new CustomHttpException(POST_ERRORS.POST_NOT_FOUND);
    }

    if (post.profile.id !== userId) {
      throw new CustomHttpException(POST_ERRORS.INVALID_USER);
    }

    if (post.images) {
      await this.awsService.deleteImages(post.images);
    }

    return await this.postsRepository.deletePost(post.id);
  }
}
