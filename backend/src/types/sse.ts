/**
 * Server-Sent Events (SSE) Type Definitions
 */

/**
 * Base SSE message structure
 */
export interface SSEMessage {
  // Event identification
  id: string; // Unique message ID (UUID v4)
  type: 'livekit' | 'system'; // Message category
  event: string; // Specific event name
  timestamp: number; // Unix timestamp (milliseconds)

  // Event data
  data: SSEMessageData;

  // Metadata
  metadata?: {
    source: 'webhook' | 'internal';
    version: string; // Protocol version (e.g., "1.0.0")
  };
}

/**
 * SSE message data payload
 */
export interface SSEMessageData {
  room?: RoomEventData;
  participant?: ParticipantEventData;
  track?: TrackEventData;
  connectionId?: string;
  serverVersion?: string;
  supportedEvents?: string[];
  error?: ErrorEventData;
  [key: string]: any;
}

/**
 * Room event data
 */
export interface RoomEventData {
  sid: string;
  name: string;
  emptyTimeout?: number;
  maxParticipants?: number;
  creationTime?: number;
  metadata?: string;
  numParticipants?: number;
  activeRecording?: boolean;
}

/**
 * Participant event data
 */
export interface ParticipantEventData {
  sid: string;
  identity: string;
  name?: string;
  state?: string;
  metadata?: string;
  joinedAt?: number;
  isPublisher?: boolean;
}

/**
 * Track event data
 */
export interface TrackEventData {
  sid: string;
  type: 'audio' | 'video' | 'data';
  source?: 'camera' | 'microphone' | 'screen_share' | 'screen_share_audio';
  muted?: boolean;
}

/**
 * Error event data
 */
export interface ErrorEventData {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

/**
 * System event types
 */
export type SystemEventType = 'connected' | 'heartbeat' | 'error' | 'disconnected';

/**
 * LiveKit event types (subset for SSE)
 */
export type LiveKitEventType =
  | 'room_started'
  | 'room_finished'
  | 'participant_joined'
  | 'participant_left'
  | 'track_published'
  | 'track_unpublished';

/**
 * Connection state for SSE clients
 */
export interface SSEClientConnection {
  id: string;
  response: any; // Express Response object
  connectedAt: number;
  lastActivity: number;
  ip?: string;
  userAgent?: string;
}

/**
 * SSE Manager statistics
 */
export interface SSEManagerStats {
  totalConnections: number;
  activeConnections: number;
  messagesSent: number;
  messagesPerSecond: number;
  averageLatency: number;
  errorCount: number;
}
