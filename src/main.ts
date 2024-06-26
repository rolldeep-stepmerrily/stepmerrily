import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import expressBasicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';
import { TransfromInterceptor } from './common/interceptors';
import { HttpExceptionFilter } from './common/filters';
import helmet from 'helmet';

const { NODE_ENV, ADMIN_NAME, ADMIN_PASSWORD, PORT } = process.env;

const isProduction = NODE_ENV === 'production';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.useGlobalInterceptors(new TransfromInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: isProduction,
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  if (isProduction) {
    app.use(helmet());
  }

  //swagger는 delevelopment 환경에서만 사용. stepmerrily는 일단 그냥 오픈.
  app.use(['/docs', '/docs-json'], expressBasicAuth({ challenge: true, users: { [ADMIN_NAME]: ADMIN_PASSWORD } }));

  const config = new DocumentBuilder()
    .setTitle('stepmerrily API Docs')
    .setDescription('⚠️: ADMIN 계정으로 로그인해주세요.')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refreshToken')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, { swaggerOptions: { defaultModelsExpandDepth: 0 } });

  await app.listen(PORT);
}
bootstrap();
