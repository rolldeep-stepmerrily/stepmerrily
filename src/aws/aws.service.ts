import { Injectable, InternalServerErrorException } from '@nestjs/common';
import AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private readonly s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadImage(
    images: Array<Express.Multer.File>,
    fisrtDist: string,
    id: number,
    secondDist: string = '',
  ) {
    const promises = images.map(async (image) => {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${fisrtDist}/${id}/${secondDist}${secondDist ? '/' : ''}${Date.now()}`,
        Body: image.buffer,
        ContentType: image.mimetype,
      };

      return await this.s3.putObject(params).promise();
    });

    try {
      await Promise.all(promises);
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }

    return `${fisrtDist}/${id}/${secondDist}${secondDist ? '/' : ''}`;
  }

  async findImage(prefix: string) {
    const objects = await this.s3
      .listObjectsV2({
        Bucket: process.env.AWS_S3_BUCKET,
        Prefix: prefix,
      })
      .promise();

    return objects.Contents && objects.Contents.length > 0
      ? `${process.env.AWS_CLOUDFRONT_DOMAIN}/${objects.Contents[0].Key}`
      : '';
  }

  async findImages(prefix: string) {
    const objects = await this.s3
      .listObjectsV2({
        Bucket: process.env.AWS_S3_BUCKET,
        Prefix: prefix,
      })
      .promise();

    if (objects.Contents) {
      return objects.Contents.map((object) => {
        return `${process.env.AWS_CLOUDFRONT_DOMAIN}/${object.Key}`;
      });
    }

    return [];
  }

  async deleteImages(firstDist: string, id: number, secondDist: string = '') {
    const objects = await this.s3
      .listObjectsV2({
        Bucket: process.env.AWS_S3_BUCKET,
        Prefix: `${firstDist}/${id}${secondDist ? '/' : ''}${secondDist}`,
      })
      .promise();

    if (objects.Contents) {
      const promises = objects.Contents.map(async (object) => {
        const params = object.Key && {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: object.Key,
        };

        return params && (await this.s3.deleteObject(params).promise());
      });

      Promise.all(promises);
    }
  }
}
