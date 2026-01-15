/**
 * Server-Sent Events (SSE) Router
 * Handles real-time event streaming to frontend clients
 */

import express, { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { sseManager } from '../services/sseManager';

const router = express.Router();

/**
 * SSE Connection Endpoint
 * GET /api/events
 *
 * Establishes a Server-Sent Events connection for real-time updates
 */
router.get('/events', (req: Request, res: Response) => {
  // Generate unique connection ID
  const connectionId = randomUUID();

  // Extract client information
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  console.log(`SSE connection attempt from ${clientIP}`);

  // Add client to SSE manager
  const added = sseManager.addClient(connectionId, res, clientIP, userAgent);

  if (!added) {
    // Connection limit reached
    res.status(429).json({
      error: 'Too many connections',
      message: 'Server connection limit reached. Please try again later.',
    });
    return;
  }

  // Handle client disconnect
  req.on('close', () => {
    console.log(`Client disconnected: ${connectionId}`);
    sseManager.removeClient(connectionId);
  });

  // Handle connection errors
  req.on('error', (error) => {
    console.error(`Connection error for ${connectionId}:`, error);
    sseManager.removeClient(connectionId);
  });

  // Keep connection alive - SSE connections should not timeout
  req.socket.setKeepAlive(true);
  req.socket.setTimeout(0);
});

/**
 * SSE Health Check Endpoint
 * GET /api/events/health
 *
 * Returns health status and statistics for SSE service
 */
router.get('/events/health', (_req: Request, res: Response) => {
  const stats = sseManager.getStats();

  res.status(200).json({
    status: 'healthy',
    connections: stats.activeConnections,
    totalConnectionsServed: stats.totalConnections,
    messagesSent: stats.messagesSent,
    messagesPerSecond: stats.messagesPerSecond.toFixed(2),
    errors: stats.errorCount,
    timestamp: new Date().toISOString(),
  });
});

/**
 * SSE Connection List Endpoint (Development only)
 * GET /api/events/clients
 *
 * Returns list of connected client IDs
 */
if (process.env.NODE_ENV === 'development') {
  router.get('/events/clients', (_req: Request, res: Response) => {
    const clientIds = sseManager.getClientIds();

    res.status(200).json({
      count: clientIds.length,
      clients: clientIds,
    });
  });
}

export default router;
