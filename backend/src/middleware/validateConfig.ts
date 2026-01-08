import { Request, Response, NextFunction } from 'express';

export const validateConfig = (req: Request, res: Response, next: NextFunction): void => {
  const { host, apiKey, apiSecret } = req.body;

  if (!host || !apiKey || !apiSecret) {
    res.status(400).json({
      success: false,
      error: 'Host, API key, and API secret are required in request body',
    });
    return;
  }

  // Basic validation - could add more sophisticated checks
  if (typeof host !== 'string' || typeof apiKey !== 'string' || typeof apiSecret !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Host, API key, and API secret must be strings',
    });
    return;
  }

  // Store config in request for use in handlers
  (req as any).livekitConfig = { host, apiKey, apiSecret };

  next();
};