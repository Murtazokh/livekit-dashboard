import type { ServerConfig } from '@/shared/types/config';
import type { ILiveKitService } from '@/core/ports/ILiveKitService';

/**
 * Use case for validating LiveKit server connection
 * Tests connectivity and credentials validity
 */
export class ValidateConnection {
  private livekitService: ILiveKitService;

  constructor(livekitService: ILiveKitService) {
    this.livekitService = livekitService;
  }

  /**
   * Execute the connection validation
   * @param config - Server configuration to validate
   * @returns Promise resolving to validation result
   */
  async execute(config: ServerConfig): Promise<ValidationResult> {
    try {
      // Initialize the service with the provided config
      this.livekitService.initialize(config);

      // Test the connection by attempting to list rooms
      // This is a lightweight operation that verifies credentials and connectivity
      await this.livekitService.listRooms();

      return {
        valid: true,
        message: 'Connection successful',
      };
    } catch (error) {
      console.error('Connection validation failed:', error);

      return {
        valid: false,
        message: this.getErrorMessage(error),
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * Extract user-friendly error message from various error types
   * @param error - The error that occurred
   * @returns User-friendly error message
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('unauthorized') || message.includes('403')) {
        return 'Invalid API credentials. Please check your API key and secret.';
      }

      if (message.includes('network') || message.includes('fetch')) {
        return 'Unable to connect to the LiveKit server. Please check the server URL and network connectivity.';
      }

      if (message.includes('timeout')) {
        return 'Connection timed out. Please check your network connection and server availability.';
      }

      if (message.includes('dns') || message.includes('resolve')) {
        return 'Server URL could not be resolved. Please check the server address.';
      }

      // Return the original message if it's already user-friendly
      return error.message;
    }

    return 'An unexpected error occurred during connection validation.';
  }
}

/**
 * Result of connection validation
 */
export interface ValidationResult {
  /** Whether the connection is valid */
  valid: boolean;

  /** User-friendly message describing the result */
  message: string;

  /** The error that occurred (if any) */
  error?: Error;
}