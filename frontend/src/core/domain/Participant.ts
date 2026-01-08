/**
 * Participant Domain Model
 * Represents a participant in a LiveKit room
 * Following Domain-Driven Design principles
 */

export const ParticipantState = {
  JOINING: 'JOINING',
  JOINED: 'JOINED',
  ACTIVE: 'ACTIVE',
  DISCONNECTED: 'DISCONNECTED',
} as const;

export type ParticipantState = (typeof ParticipantState)[keyof typeof ParticipantState];

export const ConnectionQuality = {
  EXCELLENT: 'EXCELLENT',
  GOOD: 'GOOD',
  POOR: 'POOR',
  LOST: 'LOST',
} as const;

export type ConnectionQuality = (typeof ConnectionQuality)[keyof typeof ConnectionQuality];

export interface TrackInfo {
  /** Track SID */
  sid: string;

  /** Track type (audio, video, data) */
  type: 'audio' | 'video' | 'data';

  /** Track name */
  name: string;

  /** Whether the track is muted */
  muted: boolean;

  /** Track source (camera, microphone, screen_share, etc.) */
  source?: string;

  /** Dimensions for video tracks */
  width?: number;
  height?: number;

  /** Whether simulcast is enabled */
  simulcast?: boolean;
}

export interface Participant {
  /** Unique participant identifier */
  sid: string;

  /** Participant identity (user ID or username) */
  identity: string;

  /** Display name */
  name?: string;

  /** Current participant state */
  state: ParticipantState;

  /** Participant metadata (custom application data) */
  metadata?: string;

  /** Timestamp when participant joined (Unix timestamp in seconds) */
  joinedAt: number;

  /** Whether this is a publisher (vs. subscriber only) */
  isPublisher: boolean;

  /** Connection quality indicator */
  connectionQuality?: ConnectionQuality;

  /** Published tracks */
  tracks: TrackInfo[];

  /** Participant permissions */
  permission?: {
    canPublish: boolean;
    canSubscribe: boolean;
    canPublishData: boolean;
    hidden: boolean;
    recorder: boolean;
  };
}

/**
 * Participant statistics
 */
export interface ParticipantStats {
  participantSid: string;
  identity: string;
  joinTime: number;
  duration: number; // in seconds
  bytesReceived: number;
  bytesSent: number;
  packetsLost: number;
  jitter: number;
}
