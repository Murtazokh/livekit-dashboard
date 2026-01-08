/**
 * Room Domain Model
 * Represents a LiveKit room in the system
 * Following Domain-Driven Design principles
 */

export interface Room {
  /** Unique identifier for the room */
  sid: string;

  /** Human-readable name of the room */
  name: string;

  /** Timestamp when the room was created (Unix timestamp in seconds) */
  creationTime: number;

  /** Number of participants currently in the room */
  numParticipants: number;

  /** Number of publishers in the room */
  numPublishers?: number;

  /** Maximum number of participants allowed */
  maxParticipants?: number;

  /** Room metadata (custom application data) */
  metadata?: string;

  /** Whether the room is empty */
  emptyTimeout?: number;

  /** Time when room will be automatically closed if empty */
  departureTimeout?: number;

  /** Whether the room is currently active */
  activeRecording?: boolean;
}

/**
 * Room Statistics
 * Additional metrics about a room
 */
export interface RoomStats {
  roomSid: string;
  roomName: string;
  participantCount: number;
  publisherCount: number;
  startTime: number;
  duration: number; // in seconds
  bytesReceived: number;
  bytesSent: number;
}

/**
 * Room creation parameters
 */
export interface CreateRoomParams {
  name: string;
  emptyTimeout?: number;
  maxParticipants?: number;
  metadata?: string;
}

/**
 * Room update parameters
 */
export interface UpdateRoomParams {
  metadata?: string;
}
