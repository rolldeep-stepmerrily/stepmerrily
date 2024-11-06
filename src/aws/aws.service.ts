import { Inject, Injectable } from '@nestjs/common';

import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import dayjs from 'dayjs';

import { CustomHttpException } from '@@exceptions';

import { AWS_ERRORS } from './aws.exception';

@Injectable()
export class AwsService {
  private readonly s3: S3;

  constructor(
    @Inject('AWS_REGION') private readonly awsRegion: string,
    @Inject('AWS_ACCESS_KEY_ID') private readonly awsAccessKeyId: string,
    @Inject('AWS_SECRET_ACCESS_KEY') private readonly awsSecretAccessKey: string,
    @Inject('AWS_S3_BUCKET') private readonly awsS3Bucket: string,
  ) {
    this.s3 = new S3({
      region: this.awsRegion,
      credentials: { accessKeyId: this.awsAccessKeyId, secretAccessKey: this.awsSecretAccessKey },
    });
  }

  async findImages(prefix: string) {
    const objects = await this.s3.listObjectsV2({
      Bucket: this.awsS3Bucket,
      Prefix: prefix,
    });

    return objects.Contents && objects.Contents.length > 0 ? objects.Contents : null;
  }

  async uploadImages(images: Express.Multer.File[], path: string) {
    try {
      const promises = images.map(async (image, index) => {
        const params = {
          Bucket: this.awsS3Bucket,
          Key: `${path}/${dayjs().unix()}_${index}`,
          Body: image.buffer,
          ContentType: image.mimetype,
        };

        return await new Upload({ client: this.s3, params }).done();
      });

      await Promise.all(promises);
    } catch (e) {
      console.error(e);

      throw new CustomHttpException(AWS_ERRORS.FAILED_TO_UPLOAD_FILE);
    }
  }

  async deleteImages(prefix: string) {
    const objects = await this.s3.listObjectsV2({
      Bucket: this.awsS3Bucket,
      Prefix: prefix,
    });

    if (objects.Contents && objects.Contents.length > 0) {
      const keys = objects.Contents.map((object) => ({ Key: object.Key }));

      await this.s3.deleteObjects({
        Bucket: this.awsS3Bucket,
        Delete: { Objects: keys },
      });
    }
  }
}
