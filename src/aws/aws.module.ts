import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';

@Module({
  providers: [AwsService],
  exports: [AwsService],
})
// s3 이외의 기능이 필요하게 되면 모듈을 분리할 것.
export class AwsModule {}
