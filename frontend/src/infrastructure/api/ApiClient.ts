import type { Room } from '../../core/domain/Room';
import type { Participant } from '../../core/domain/Participant';
import type { Agent } from '../../core/domain/Agent';
import type { ServerConfig } from '../../shared/types/config';
import type { ILiveKitService } from '../../core/ports/ILiveKitService';
import type { ApiResponse, ValidateConfigResponse } from '../../shared/types/api';

/**
 * HTTP API client implementation of LiveKit service
 * Communicates with the backend API to access LiveKit server data
 */
export class ApiClient implements ILiveKitService {
  private baseUrl: string;
  private config: ServerConfig | null = null;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  initialize(config: ServerConfig): void {
    this.config = config;
  }

  async listRooms(): Promise<Room[]> {
    const response = await this.makeRequest<ApiResponse<Room[]>>('/rooms');
    return response.data || [];
  }

  async getRoomDetails(roomName: string): Promise<Room | null> {
    const response = await this.makeRequest<ApiResponse<Room>>(`/rooms/${encodeURIComponent(roomName)}`);
    return response.data || null;
  }

  async listParticipants(roomName: string): Promise<Participant[]> {
    const response = await this.makeRequest<ApiResponse<Participant[]>>(`/rooms/${encodeURIComponent(roomName)}/participants`);
    return response.data || [];
  }

  async getAgents(roomName?: string): Promise<Agent[]> {
    const endpoint = roomName
      ? `/rooms/${encodeURIComponent(roomName)}/agents`
      : '/agents'; // Fallback endpoint if roomName not provided

    try {
      const response = await this.makeRequest<ApiResponse<Agent[]>>(endpoint);
      return response.data || [];
    } catch (error) {
      // If the general agents endpoint doesn't exist, return empty array
      console.warn('Agents endpoint not available:', error);
      return [];
    }
  }

  /**
   * Validate server configuration
   * @param config - Configuration to validate
   * @returns Promise resolving to validation result
   */
  async validateConnection(config: ServerConfig): Promise<boolean> {
    try {
      const response = await this.makeRequest<ValidateConfigResponse>('/config/validate', {
        method: 'POST',
        body: JSON.stringify(config),
      });
      return response.valid;
    } catch (error) {
      console.error('Configuration validation failed:', error);
      return false;
    }
  }

  /**
   * Generate access token for connecting to a room
   * @param roomName - Name of the room to join
   * @param participantIdentity - Unique identifier for the participant
   * @param participantName - Display name for the participant
   * @returns Promise resolving to token and server URL
   */
  async generateRoomToken(
    roomName: string,
    participantIdentity: string,
    participantName?: string
  ): Promise<{ token: string; serverUrl: string }> {
    const response = await this.makeRequest<ApiResponse<{ token: string; serverUrl: string }>>(
      `/rooms/${encodeURIComponent(roomName)}/token`,
      {
        method: 'POST',
        body: JSON.stringify({ participantIdentity, participantName }),
      }
    );
    return response.data!;
  }

  /**
   * Make an HTTP request to the API
   * @param endpoint - API endpoint (without base URL)
   * @param options - Fetch options
   * @returns Promise resolving to parsed JSON response
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add LiveKit credentials to headers if available
    if (this.config) {
      defaultHeaders['X-LiveKit-Host'] = this.config.serverUrl;
      defaultHeaders['X-LiveKit-Key'] = this.config.apiKey;
      defaultHeaders['X-LiveKit-Secret'] = this.config.apiSecret;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}