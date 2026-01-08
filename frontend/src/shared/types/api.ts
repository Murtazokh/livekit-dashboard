/**
 * API Types
 * Common types for API requests and responses
 */

import type { Room } from '@/core/domain/Room';
import type { Participant } from '@/core/domain/Participant';
import type { Agent } from '@/core/domain/Agent';

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: number;
}

/**
 * API Error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

/**
 * Error codes
 */
export const ApiErrorCode = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SERVER_UNREACHABLE: 'SERVER_UNREACHABLE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  TIMEOUT: 'TIMEOUT',
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Room API responses
 */
export type GetRoomsResponse = ApiResponse<Room[]>;
export type GetRoomResponse = ApiResponse<Room>;

/**
 * Participant API responses
 */
export type GetParticipantsResponse = ApiResponse<Participant[]>;
export type GetParticipantResponse = ApiResponse<Participant>;

/**
 * Agent API responses
 */
export type GetAgentsResponse = ApiResponse<Agent[]>;
export type GetAgentResponse = ApiResponse<Agent>;

/**
 * Configuration validation response
 */
export interface ValidateConfigResponse {
  valid: boolean;
  message?: string;
}
