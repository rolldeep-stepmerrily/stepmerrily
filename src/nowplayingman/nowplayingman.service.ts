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

      console.log(errorMessage);

      throw new Error(errorMessage);
    }

    const shortData = await getShortResponse.json();

    console.log({ shortData });

    const shortAccessToken = shortData.access_token;

    console.log({ shortAccessToken });

    const getLongUrl = 'https://graph.threads.net/access_token';

    const longPayloadForm = new URLSearchParams({
      grant_type: 'th_exchange_token',
      client_secret: this.threadsAppSecret,
      access_token: shortAccessToken,
    });

    console.log('Sending payload:', longPayloadForm.toString());

    const getLongResponse = await fetch(getLongUrl, {
      method: 'POST',
      body: longPayloadForm.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!getLongResponse.ok) {
      const errorMessage = await getLongResponse.text();

      console.log(errorMessage);

      throw new Error(errorMessage);
    }

    const longData = await getLongResponse.json();

    console.log({ longData });

    const longAccessToken = longData.access_token;

    console.log({ longAccessToken });

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
