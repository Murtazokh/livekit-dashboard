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

  // Only log in development mode and only on first request
  const isDev = process.env.NODE_ENV === 'development';
  const shouldLog = isDev && Math.random() < 0.01; // Log ~1% of requests in dev

  if (shouldLog) {
    console.log('LiveKit config status:', {
      hasConfig: !!(host && apiKey && apiSecret)
    });
  }

  if (host && apiKey && apiSecret) {
    // Convert WebSocket URLs to HTTP URLs for the SDK
    let httpHost = host;
    if (host.startsWith('wss://')) {
      httpHost = host.replace('wss://', 'https://');
    } else if (host.startsWith('ws://')) {
      httpHost = host.replace('ws://', 'http://');
    }

    req.livekitConfig = {
      host: httpHost,
      apiKey,
      apiSecret
    };
  }

  next();
};