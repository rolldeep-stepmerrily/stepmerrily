declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_URL: string;
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    ADMIN_NAME: string;
    ADMIN_PASSWORD: string;
    GUEST_NAME: string;
    GUEST_PASSWORD: string;
    JWT_SECRET_KEY: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    AWS_S3_BUCKET: string;
    AWS_CLOUDFRONT_DOMAIN: string;
    REDIS_HOST: string;
    REDIS_PASSWORD: string;
    REDIS_PORT: number;
    GIT_ACCESS_TOKEN: string;
    LAST_FM_API_KEY: string;
    LAST_FM_API_SECRET: string;
    LAST_FM_API_URL: string;
    THREADS_APP_ID: string;
    THREADS_REDIRECT_URI: string;
    THREADS_SCOPE: string;
    THREADS_APP_SECRET: string;
  }
}
