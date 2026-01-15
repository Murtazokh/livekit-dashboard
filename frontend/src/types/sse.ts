/**
 * Server-Sent Events (SSE) Type Definitions for Frontend
 */

/**
 * Base SSE message structure received from backend
 */
export interface SSEMessage {
  id: string;
  type: 'livekit' | 'system';
  event: string;
  timestamp: number;
  data: SSEMessageData;
  metadata?: {
    source: 'webhook' | 'internal';
    version: string;
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
 * Connection state for SSE
 */
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

/**
 * LiveKit event types
 */
export type LiveKitEventType =
  | 'room_started'
  | 'room_finished'
  | 'participant_joined'
  | 'participant_left'
  | 'track_published'
  | 'track_unpublished';

/**
 * System event types
 */
export type SystemEventType = 'connected' | 'heartbeat' | 'error' | 'disconnected';
