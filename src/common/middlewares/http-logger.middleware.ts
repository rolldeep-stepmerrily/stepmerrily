import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

interface IRequest extends Request {
  user?: { id: number };
}

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: IRequest, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const userIp = req.ips.length ? req.ips[0] : req.ip;
      const userId = req.user?.id ? ` ${req.user?.id} ` : ' ';
      const contentLength = res.getHeader('content-length') || 0;
      const referrer = req.header('Referer') || req.header('Referrer');
      const fommattedReferrer = referrer ? ` "${referrer}" ` : ' ';
      const userAgent = req.header('user-agent');
      const responseTime = Date.now() - startTime;

      const message = `${userIp} -${userId}"${req.method} ${req.originalUrl} HTTP/${req.httpVersion}" ${res.statusCode} - ${contentLength}${fommattedReferrer}"${userAgent}" \x1b[33m+${responseTime}ms`;

      if (res.statusCode >= 400) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
