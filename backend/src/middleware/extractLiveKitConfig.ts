import { Request, Response, NextFunction } from 'express';

export interface LiveKitConfig {
  host: string;
  apiKey: string;
  apiSecret: string;
}

declare global {
  namespace Express {
    interface Request {
      livekitConfig?: LiveKitConfig;
    }
  }
}

/**
 * Middleware to extract LiveKit configuration from request headers
 * Adds livekitConfig to the request object
 */
export const extractLiveKitConfig = (req: Request, _res: Response, next: NextFunction): void => {
  const host = req.headers['x-livekit-host'] as string;
  const apiKey = req.headers['x-livekit-key'] as string;
  const apiSecret = req.headers['x-livekit-secret'] as string;

  if (host && apiKey && apiSecret) {
    req.livekitConfig = { host, apiKey, apiSecret };
  }

  next();
};