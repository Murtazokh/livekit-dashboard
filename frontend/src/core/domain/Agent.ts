/**
 * Agent Domain Model
 * Represents a LiveKit agent (AI/bot participant)
 * Following Domain-Driven Design principles
 */

export const AgentState = {
  INITIALIZING: 'INITIALIZING',
  IDLE: 'IDLE',
  ACTIVE: 'ACTIVE',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR',
} as const;

export type AgentState = (typeof AgentState)[keyof typeof AgentState];

export const AgentType = {
  VOICE: 'VOICE',
  CHAT: 'CHAT',
  TRANSCRIPTION: 'TRANSCRIPTION',
  CUSTOM: 'CUSTOM',
} as const;

export type AgentType = (typeof AgentType)[keyof typeof AgentType];

export interface AgentJob {
  /** Job identifier */
  id: string;

  /** Job type */
  type: string;

  /** Room the job is for */
  roomName: string;

  /** Participant the job is for (optional) */
  participantIdentity?: string;

  /** Job status */
  status: 'pending' | 'running' | 'completed' | 'failed';

  /** Job metadata */
  metadata?: string;

  /** When the job was created */
  createdAt: number;

  /** When the job started */
  startedAt?: number;

  /** When the job ended */
  endedAt?: number;
}

export interface Agent {
  /** Unique agent identifier */
  id: string;

  /** Agent name */
  name: string;

  /** Agent type */
  type: AgentType;

  /** Current state */
  state: AgentState;

  /** Agent version */
  version?: string;

  /** Room the agent is in (if any) */
  roomName?: string;

  /** Participant SID if agent is in a room */
  participantSid?: string;

  /** Agent metadata */
  metadata?: string;

  /** Current job being processed */
  currentJob?: AgentJob;

  /** Jobs queue */
  jobsQueue?: AgentJob[];

  /** When the agent was started */
  startedAt: number;

  /** Last activity timestamp */
  lastActivityAt: number;

  /** Agent capabilities */
  capabilities?: {
    canSpeak: boolean;
    canListen: boolean;
    canTranscribe: boolean;
    canAnalyze: boolean;
  };

  /** Resource usage */
  resources?: {
    cpuUsage?: number;
    memoryUsage?: number;
  };
}

/**
 * Agent dispatch information
 */
export interface AgentDispatch {
  agentId: string;
  roomName: string;
  participantIdentity?: string;
  metadata?: string;
}

/**
 * Agent configuration
 */
export interface AgentConfig {
  name: string;
  type: AgentType;
  metadata?: string;
  autoStart?: boolean;
}
