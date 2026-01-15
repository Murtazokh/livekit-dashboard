/**
 * LiveKit Webhook Event Types
 * Based on LiveKit Server SDK webhook events
 */

export interface WebhookEvent {
  event: WebhookEventType;
  room?: RoomInfo;
  participant?: ParticipantInfo;
  track?: TrackInfo;
  egressInfo?: EgressInfo;
  ingressInfo?: IngressInfo;
  createdAt?: number;
  id?: string;
}

export type WebhookEventType =
  // Room events
  | 'room_started'
  | 'room_finished'
  // Participant events
  | 'participant_joined'
  | 'participant_left'
  // Track events
  | 'track_published'
  | 'track_unpublished'
  // Egress events
  | 'egress_started'
  | 'egress_updated'
  | 'egress_ended'
  // Ingress events
  | 'ingress_started'
  | 'ingress_updated'
  | 'ingress_ended';

export interface RoomInfo {
  sid: string;
  name: string;
  emptyTimeout?: number;
  maxParticipants?: number;
  creationTime?: number;
  turnPassword?: string;
  enabledCodecs?: any[];
  metadata?: string;
  numParticipants?: number;
  activeRecording?: boolean;
}

export interface ParticipantInfo {
  sid: string;
  identity: string;
  state?: ParticipantState;
  tracks?: TrackInfo[];
  metadata?: string;
  joinedAt?: number;
  name?: string;
  version?: number;
  permission?: ParticipantPermission;
  region?: string;
  isPublisher?: boolean;
}

export enum ParticipantState {
  JOINING = 0,
  JOINED = 1,
  ACTIVE = 2,
  DISCONNECTED = 3,
}

export interface ParticipantPermission {
  canSubscribe?: boolean;
  canPublish?: boolean;
  canPublishData?: boolean;
  hidden?: boolean;
  recorder?: boolean;
}

export interface TrackInfo {
  sid: string;
  type: TrackType;
  name?: string;
  muted?: boolean;
  width?: number;
  height?: number;
  simulcast?: boolean;
  disableDtx?: boolean;
  source?: TrackSource;
  layers?: any[];
  mimeType?: string;
  mid?: string;
  codecs?: any[];
}

export enum TrackType {
  AUDIO = 0,
  VIDEO = 1,
  DATA = 2,
}

export enum TrackSource {
  UNKNOWN = 0,
  CAMERA = 1,
  MICROPHONE = 2,
  SCREEN_SHARE = 3,
  SCREEN_SHARE_AUDIO = 4,
}

export interface EgressInfo {
  egressId: string;
  roomId: string;
  roomName?: string;
  status?: EgressStatus;
  startedAt?: number;
  endedAt?: number;
  error?: string;
}

export enum EgressStatus {
  EGRESS_STARTING = 0,
  EGRESS_ACTIVE = 1,
  EGRESS_ENDING = 2,
  EGRESS_COMPLETE = 3,
  EGRESS_FAILED = 4,
  EGRESS_ABORTED = 5,
}

export interface IngressInfo {
  ingressId: string;
  name?: string;
  streamKey?: string;
  url?: string;
  inputType?: IngressInput;
  roomName?: string;
  participantIdentity?: string;
  participantName?: string;
  state?: IngressState;
}

export enum IngressInput {
  RTMP_INPUT = 0,
  WHIP_INPUT = 1,
}

export interface IngressState {
  status?: IngressStatus;
  error?: string;
  startedAt?: number;
  endedAt?: number;
}

export enum IngressStatus {
  ENDPOINT_BUFFERING = 0,
  ENDPOINT_PUBLISHING = 1,
  ENDPOINT_ERROR = 2,
  ENDPOINT_COMPLETE = 3,
}
