import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import dayjs from 'dayjs';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET } = process.env;

@Injectable()
export class AwsService {
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3({
      region: AWS_REGION,
      credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
    });
  }

  async findImages(prefix: string) {
    const objects = await this.s3.listObjectsV2({
      Bucket: AWS_S3_BUCKET,
      Prefix: prefix,
    });

    return objects.Contents && objects.Contents.length > 0 ? objects.Contents : null;
  }

  async uploadImages(images: Express.Multer.File[], firstDist: string, id: number, secondDist: string = '') {
    try {
      const promises = images.map(async (image, index) => {
        const params = {
          Bucket: AWS_S3_BUCKET,
          Key: `${firstDist}/${id}/${secondDist}${secondDist ? '/' : ''}${dayjs().unix()}_${index}`,
          Body: image.buffer,
          ContentType: image.mimetype,
        };

        return await new Upload({ client: this.s3, params }).done();
      });

      await Promise.all(promises);

      return `${firstDist}/${id}/${secondDist}${secondDist ? '/' : ''}`;
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
