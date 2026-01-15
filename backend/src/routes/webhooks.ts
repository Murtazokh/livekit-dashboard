/**
 * LiveKit Webhooks Router
 * Receives and processes webhook events from LiveKit server
 */

import express, { Request, Response } from 'express';
import { WebhookReceiver, WebhookEvent } from 'livekit-server-sdk';
import { sseManager } from '../services/sseManager';
import { SSEMessage } from '../types/sse';

const router = express.Router();

// Extend Request type to include rawBody
declare module 'express-serve-static-core' {
  interface Request {
    rawBody?: string;
  }
}

// Initialize WebhookReceiver with API credentials
// These can come from env variables or be set per-request via headers
let webhookReceiver: WebhookReceiver | null = null;

// Try to initialize with env variables if available
if (process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET) {
  webhookReceiver = new WebhookReceiver(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
  );
  console.log('WebhookReceiver initialized with environment credentials');
}

/**
 * LiveKit Webhook Endpoint
 * POST /api/webhooks/livekit
 *
 * Receives webhook events from LiveKit server, verifies signature,
 * and broadcasts to connected SSE clients
 *
 * Note: req.body contains the raw string body (from express.text() middleware in server.ts)
 */
router.post('/livekit', express.json(), async (req: Request, res: Response) => {
  try {
    // Get webhook receiver instance
    let receiver = webhookReceiver;

    // If no global receiver, try to create from request config
    if (!receiver && req.livekitConfig) {
      receiver = new WebhookReceiver(
        req.livekitConfig.apiKey,
        req.livekitConfig.apiSecret
      );
    }

    if (!receiver) {
      console.error('No LiveKit credentials available for webhook verification');
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'LiveKit credentials not configured',
      });
    }

    // Extract authorization header (contains signature)
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader) {
      console.warn('Webhook received without authorization header');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing authorization header',
      });
    }

    // Debug logging
    console.log('[Webhook Debug] Content-Type:', req.headers['content-type']);
    console.log('[Webhook Debug] Body type:', typeof req.body);
    console.log('[Webhook Debug] Has rawBody:', !!req.rawBody);
    console.log('[Webhook Debug] Auth header:', authHeader);
    console.log('[Webhook Debug] Using API Key:', receiver === webhookReceiver ? process.env.LIVEKIT_API_KEY : req.livekitConfig?.apiKey);

    // Use captured raw body for signature verification (preserves exact formatting)
    const rawBody = req.rawBody || JSON.stringify(req.body);
    console.log('[Webhook Debug] Using rawBody length:', rawBody.length);

    // Verify webhook signature and parse event
    const event: WebhookEvent = await receiver.receive(
      rawBody,
      authHeader as string
    );

    console.log(`Webhook received: ${event.event}`, {
      room: event.room?.name,
      participant: event.participant?.identity,
    });

    // Transform webhook event to SSE message
    const sseMessage = transformWebhookToSSE(event);

    // Broadcast to all connected SSE clients
    sseManager.broadcast(sseMessage);

    // Respond to LiveKit with success
    return res.status(200).send('OK');
  } catch (error: any) {
    // Signature verification failed or invalid payload
    console.error('Webhook processing error:', error.message);

    // Log security event
    const clientIP = req.ip || req.connection.remoteAddress;
    console.warn(`Invalid webhook from ${clientIP}:`, error.message);

    return res.status(400).json({
      error: 'Invalid webhook',
      message: 'Signature verification failed or malformed payload',
    });
  }
});

/**
 * Transform LiveKit webhook event to SSE message format
 */
/**
 * Convert bigint to number safely
 */
function toNumber(value: number | bigint | undefined): number | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'bigint' ? Number(value) : value;
}

function transformWebhookToSSE(event: WebhookEvent): SSEMessage {
  const message: SSEMessage = {
    id: event.id || `webhook_${Date.now()}`,
    type: 'livekit',
    event: event.event,
    timestamp: toNumber(event.createdAt) || Date.now(),
    data: {},
    metadata: {
      source: 'webhook',
      version: '1.0.0',
    },
  };

  // Add room data if present
  if (event.room) {
    message.data.room = {
      sid: event.room.sid,
      name: event.room.name,
      emptyTimeout: event.room.emptyTimeout,
      maxParticipants: event.room.maxParticipants,
      creationTime: toNumber(event.room.creationTime),
      metadata: event.room.metadata,
      numParticipants: event.room.numParticipants,
      activeRecording: event.room.activeRecording,
    };
  }

  // Add participant data if present
  if (event.participant) {
    message.data.participant = {
      sid: event.participant.sid,
      identity: event.participant.identity,
      name: event.participant.name,
      state: event.participant.state?.toString(),
      metadata: event.participant.metadata,
      joinedAt: toNumber(event.participant.joinedAt),
      isPublisher: event.participant.isPublisher,
    };
  }

  // Add track data if present
  if (event.track) {
    message.data.track = {
      sid: event.track.sid,
      type: event.track.type === 0 ? 'audio' : event.track.type === 1 ? 'video' : 'data',
      source: getTrackSource(event.track.source),
      muted: event.track.muted,
    };
  }

  return message;
}

/**
 * Convert track source enum to string
 */
function getTrackSource(source?: number): 'camera' | 'microphone' | 'screen_share' | 'screen_share_audio' | undefined {
  if (source === undefined) return undefined;

  switch (source) {
    case 1:
      return 'camera';
    case 2:
      return 'microphone';
    case 3:
      return 'screen_share';
    case 4:
      return 'screen_share_audio';
    default:
      return undefined;
  }
}

export default router;
