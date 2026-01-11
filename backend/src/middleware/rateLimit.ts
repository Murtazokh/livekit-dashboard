import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter (in production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 1 * 60 * 1000; // 1 minute
const MAX_REQUESTS = 1000; // requests per window (generous for development)

export const rateLimit = (req: Request, res: Response, next: NextFunction): void => {
  const clientIP = req.ip || 'unknown';
  const now = Date.now();

  const clientData = requestCounts.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    // First request or window expired
    requestCounts.set(clientIP, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    next();
    return;
  }

  if (clientData.count >= MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later',
    });
    return;
  }

  clientData.count++;
  next();
};