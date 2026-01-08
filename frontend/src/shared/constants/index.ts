/**
 * Application Constants
 * Centralized location for all constant values
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  CONFIG: {
    VALIDATE: '/api/config/validate',
  },
  ROOMS: {
    LIST: '/api/rooms',
    DETAILS: (roomName: string) => `/api/rooms/${roomName}`,
    PARTICIPANTS: (roomName: string) => `/api/rooms/${roomName}/participants`,
  },
  PARTICIPANTS: {
    LIST: '/api/participants',
  },
  AGENTS: {
    LIST: '/api/agents',
    DETAILS: (agentId: string) => `/api/agents/${agentId}`,
  },
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  SERVER_CONFIG: 'livekit_server_config',
  THEME: 'livekit_theme',
  USER_PREFERENCES: 'livekit_preferences',
} as const;

/**
 * Query Keys for React Query
 */
export const QUERY_KEYS = {
  ROOMS: 'rooms',
  ROOM_DETAILS: (roomName: string) => ['room', roomName],
  PARTICIPANTS: 'participants',
  ROOM_PARTICIPANTS: (roomName: string) => ['participants', roomName],
  AGENTS: 'agents',
  AGENT_DETAILS: (agentId: string) => ['agent', agentId],
  CONFIG: 'config',
} as const;

/**
 * Polling Intervals (in milliseconds)
 */
export const POLLING_INTERVALS = {
  ROOMS: 5000, // 5 seconds
  PARTICIPANTS: 3000, // 3 seconds
  AGENTS: 5000, // 5 seconds
  DASHBOARD: 5000, // 5 seconds
} as const;

/**
 * UI Constants
 */
export const UI = {
  PAGE_TITLE: 'LiveKit Dashboard',
  MAX_ITEMS_PER_PAGE: 20,
  TOAST_DURATION: 3000, // 3 seconds
  DEBOUNCE_DELAY: 300, // 300ms
} as const;

/**
 * Route Paths
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ROOMS: '/rooms',
  ROOM_DETAILS: (roomName: string) => `/rooms/${roomName}`,
  PARTICIPANTS: '/participants',
  AGENTS: '/agents',
  SETTINGS: '/settings',
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Invalid credentials. Please check your API key and secret.',
  SERVER_UNREACHABLE: 'Cannot reach LiveKit server. Please check the URL.',
  VALIDATION_ERROR: 'Invalid configuration. Please check your settings.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
  TIMEOUT: 'Request timed out. Please try again.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  CONFIG_SAVED: 'Configuration saved successfully',
  CONFIG_VALIDATED: 'Connection validated successfully',
} as const;
