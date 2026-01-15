import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import apiRoutes from './routes/api';
import sseRoutes from './routes/sse';
import webhookRoutes from './routes/webhooks';
import { extractLiveKitConfig } from './middleware/extractLiveKitConfig';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parse JSON bodies - also accept LiveKit's webhook content type
// Capture raw body for webhook signature verification
app.use(express.json({
  limit: '10mb',
  type: ['application/json', 'application/webhook+json'],
  verify: (req: any, _res, buf) => {
    // Store raw body for webhook signature verification
    if (req.url && req.url.includes('/webhooks/')) {
      req.rawBody = buf.toString('utf8');
    }
  }
}));
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', apiRoutes);

// SSE routes (real-time events)
app.use('/api', sseRoutes);

// Webhook routes (LiveKit event ingestion)
// Apply LiveKit config extraction middleware for webhook auth
app.use('/api/webhooks', extractLiveKitConfig, webhookRoutes);

// Health check and root
app.get('/', (_req, res) => {
  res.json({ message: 'LiveKit Dashboard API' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;