declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    ADMIN_NAME: string;
    ADMIN_PASSWORD: string;
    AWS_S3_BUCKET: string;
  }
}
