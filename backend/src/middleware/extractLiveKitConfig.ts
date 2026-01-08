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

  console.log('Extracting LiveKit config:', {
    host: host ? '[REDACTED]' : undefined,
    hasApiKey: !!apiKey,
    hasApiSecret: !!apiSecret,
    allHeaders: Object.keys(req.headers).filter(h => h.toLowerCase().includes('livekit'))
  });

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

    console.log('LiveKit config extracted successfully');
  } else {
    console.log('LiveKit config not found in headers');
  }

  next();
};