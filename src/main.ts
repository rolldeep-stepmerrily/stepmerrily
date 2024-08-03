import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';
import expressBasicAuth from 'express-basic-auth';
import * as fs from 'fs';

import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors';
import { HttpExceptionFilter } from './common/filters';

const { NODE_ENV, AWS_CLOUDFRONT_DOMAIN, PORT, GUEST_NAME, GUEST_PASSWORD } = process.env;

const isProduction = NODE_ENV === 'production';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new TransformInterceptor());

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
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: { defaultSrc: ["'self'"], imgSrc: ["'self'", 'data:', `${AWS_CLOUDFRONT_DOMAIN}`] },
        },
      }),
    );
  }

  app.use(['/', '/-json'], expressBasicAuth({ challenge: true, users: { [GUEST_NAME]: GUEST_PASSWORD } }));

  app.use(express.static(join(__dirname, '..', 'swagger')));
  app.useStaticAssets(join(__dirname, '..', 'swagger'), {
    prefix: '/swagger/',
  });

  const updateInfo = fs.readFileSync(join(__dirname, '..', 'swagger', 'swagger-info.md'), 'utf8');

  const config = new DocumentBuilder()
    .setDescription(updateInfo)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refreshToken')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: 0,
      persistAuthorization: true,
      syntaxHighlight: { theme: 'arta' },
      tryItOutEnabled: true,
    },
    customJs: '/swagger-dark.js',
    customCssUrl: '/swagger-dark.css',
  });

  await app.listen(PORT);
}

bootstrap();
