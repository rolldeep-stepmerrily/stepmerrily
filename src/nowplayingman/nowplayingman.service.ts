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
    @Inject('THREADS_USER_ID') private readonly threadsUserId: number,
    @Inject('THREADS_ACCESS_TOKEN') private readonly threadsAccessToken: string,
    @Inject('AWS_CLOUDFRONT_DOMAIN') private readonly awsCloudfrontDomain: string,
    private readonly awsService: AwsService,
  ) {}

  async getAuthUrl() {
    return `https://threads.net/oauth/authorize?client_id=${this.threadsAppId}&redirect_uri=${this.threadsRedirectUri}&scope=${this.threadsScope}&response_type=code`;
  }

  async getToken(code: string) {
    const getShortUrl = 'https://graph.threads.net/oauth/access_token';

    const shortPayloadForm = new URLSearchParams({
      client_id: this.threadsAppId,
      client_secret: this.threadsAppSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.threadsRedirectUri,
      code,
    });

    console.log('Sending payload:', shortPayloadForm.toString());

    const getShortResponse = await fetch(getShortUrl, {
      method: 'POST',
      body: shortPayloadForm.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!getShortResponse.ok) {
      const errorMessage = await getShortResponse.text();

      console.error(errorMessage);

      throw new Error(errorMessage);
    }

    const shortData = await getShortResponse.json();

    const shortAccessToken = shortData.access_token;

    const getLongUrl = 'https://graph.threads.net/access_token';

    const getLongResponse = await fetch(
      `${getLongUrl}?grant_type=th_exchange_token&client_secret=${this.threadsAppSecret}&access_token=${shortAccessToken}`,
    );

    if (!getLongResponse.ok) {
      const errorMessage = await getLongResponse.text();

      console.error(errorMessage);

      throw new Error(errorMessage);
    }

    const longData = await getLongResponse.json();

    const longAccessToken = longData.access_token;

    return longAccessToken;
  }

  async processImage(file: Express.Multer.File) {
    const metadata = await sharp(file.buffer).metadata();

    const width = metadata.width ?? 0;
    const height = (metadata.height ?? 0) - 860 - 325;

    const buffer = await sharp(file.buffer).extract({ left: 0, top: 325, width, height }).toBuffer();

    const now = dayjs().unix();
    const path = `nowplayingman/${now}`;

    await this.awsService.uploadImages([{ ...file, buffer }], path);

    const url = `https://graph.threads.net/v1.0/${this.threadsUserId}/threads`;

    const payload = new URLSearchParams({
      media_type: 'IMAGE',
      image_url: `${this.awsCloudfrontDomain}/${path}/${now}_0`,
      text: '#지듣노',
      access_token: this.threadsAccessToken,
    });

    const response = await fetch(url, {
      method: 'POST',
      body: payload.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();

      console.log(url);
      console.error(errorMessage);

      throw new Error(errorMessage);
    }

    const data = await response.json();

    console.log(data);

    const id = data.id;

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const publishUrl = `https://graph.threads.net/v1.0/${this.threadsUserId}/threads_publish?creation_id=${id}&access_token=${this.threadsAccessToken}`;

    await fetch(publishUrl, { method: 'POST' });

    return true;
  }
}
