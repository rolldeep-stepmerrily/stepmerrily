import { Inject, Injectable } from '@nestjs/common';

import dayjs from 'dayjs';
import sharp from 'sharp';

import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class NowplayingmanService {
  constructor(
    @Inject('THREADS_APP_ID') private readonly threadsAppId: string,
    @Inject('THREADS_REDIRECT_URI') private readonly threadsRedirectUri: string,
    @Inject('THREADS_SCOPE') private readonly threadsScope: string,
    @Inject('THREADS_APP_SECRET') private readonly threadsAppSecret: string,
    @Inject('THREADS_USER_ID') private readonly threadsUserId: string,
    @Inject('AWS_CLOUDFRONT_DOMAIN') private readonly awsCloudfrontDomain: string,
    private readonly awsService: AwsService,
  ) {}

  async getAuthUrl() {
    return `https://threads.net/oauth/authorize?client_id=${this.threadsAppId}&redirect_uri=${this.threadsRedirectUri}&scope=${this.threadsScope}&response_type=code`;
  }

  async getToken(code: string) {
    const getShortUrl = 'https://graph.threads.net/oauth/access_token';

    const shortPayload = {
      client_id: this.threadsAppId,
      client_secret: this.threadsAppSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.threadsRedirectUri,
      code,
    };

    const getShortResponse = await fetch(getShortUrl, {
      method: 'POST',
      body: JSON.stringify(shortPayload),
    });

    console.log(getShortResponse);
    const shortData = await getShortResponse.json();

    const shortAccessToken = shortData.access_token;

    const getLongUrl = 'https://graph.threads.net/access_token';

    const longPayload = {
      grant_type: 'th_exchange_token',
      client_secret: this.threadsAppSecret,
      access_token: shortAccessToken,
    };

    console.log(longPayload);

    const getLongResponse = await fetch(getLongUrl, {
      method: 'POST',
      body: JSON.stringify(longPayload),
    });

    console.dir(getLongResponse, { depth: null });

    const longData = await getLongResponse.json();

    const longAccessToken = longData.access_token;

    return longAccessToken;
  }

  async processImage(file: Express.Multer.File, token: string) {
    const metadata = await sharp(file.buffer).metadata();

    const width = metadata.width ?? 0;
    const height = (metadata.height ?? 0) - 860;

    const buffer = await sharp(file.buffer).extract({ left: 0, top: 325, width, height }).toBuffer();

    const now = dayjs().unix();
    const path = `nowplayingman/${now}`;

    await this.awsService.uploadImages([{ ...file, buffer }], path);

    const url = `https://graph.threads.net/v1.0/${this.threadsUserId}/threads?media_type=IMAGE&image_url=${this.awsCloudfrontDomain}/${path}/${now}_0&text=#지듣노&access_token=${token}`;

    const response = await fetch(url, {
      method: 'POST',
    });

    const data = await response.json();

    const id = data.id;

    await new Promise((resolve) => setTimeout(resolve, 30000));

    const publishUrl = `https://graph.threads.net/v1.0/${this.threadsUserId}/threads_publish?creation_id=${id}&access_token=${token}`;

    const publishResponse = await fetch(publishUrl, {
      method: 'POST',
    });

    const publishData = await publishResponse.json();

    console.log(publishData);
  }
}
