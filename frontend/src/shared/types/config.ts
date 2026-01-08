/**
 * Server Configuration Types
 * Used for storing and managing LiveKit server connection details
 */

export interface ServerConfig {
  /** LiveKit server URL (e.g., ws://localhost:7880 or wss://livekit.example.com) */
  serverUrl: string;

  /** API Key for authentication */
  apiKey: string;

  /** API Secret for authentication */
  apiSecret: string;
}

/**
 * Validation result for server configuration
 */
export interface ConfigValidationResult {
  valid: boolean;
  error?: string;
  serverInfo?: {
    version?: string;
    region?: string;
  };
}

/**
 * Connection status
 */
export const ConnectionStatus = {
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  ERROR: 'ERROR',
} as const;

export type ConnectionStatus = (typeof ConnectionStatus)[keyof typeof ConnectionStatus];

/**
 * Connection state
 */
export interface ConnectionState {
  status: ConnectionStatus;
  error?: string;
  lastConnected?: number;
  config?: ServerConfig;
}
