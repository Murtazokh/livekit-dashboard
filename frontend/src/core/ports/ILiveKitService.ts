import type { Room } from '../domain/Room';
import type { Participant } from '../domain/Participant';
import type { Agent } from '../domain/Agent';
import type { ServerConfig } from '../../shared/types/config';

/**
 * Interface for LiveKit service operations
 * Defines the contract for interacting with LiveKit server
 */
export interface ILiveKitService {
  /**
   * Initialize the service with server configuration
   * @param config - Server configuration including host, API key, and secret
   */
  initialize(config: ServerConfig): void;

  /**
   * List all active rooms
   * @returns Promise resolving to array of rooms
   */
  listRooms(): Promise<Room[]>;

  /**
   * Get detailed information about a specific room
   * @param roomName - Name of the room to retrieve
   * @returns Promise resolving to room details or null if not found
   */
  getRoomDetails(roomName: string): Promise<Room | null>;

  /**
   * List all participants in a specific room
   * @param roomName - Name of the room
   * @returns Promise resolving to array of participants
   */
  listParticipants(roomName: string): Promise<Participant[]>;

  /**
   * Get agents for a specific room
   * @param roomName - Name of the room (optional, returns empty if not provided)
   * @returns Promise resolving to array of agents
   */
  getAgents(roomName?: string): Promise<Agent[]>;

  /**
   * Get all agent dispatches across all rooms
   * @returns Promise resolving to array of all agent dispatches
   */
  getAllAgents(): Promise<Agent[]>;

  /**
   * Create a new agent dispatch for a room
   * @param roomName - Name of the room
   * @param agentName - Name of the agent to dispatch
   * @param metadata - Optional metadata for the agent
   * @returns Promise resolving to the created dispatch
   */
  createAgentDispatch(
    roomName: string,
    agentName: string,
    metadata?: string
  ): Promise<{ id: string; agentName: string; room: string; metadata?: string }>;

  /**
   * Delete an agent dispatch
   * @param dispatchId - ID of the dispatch to delete
   * @param roomName - Name of the room
   * @returns Promise resolving when deletion is complete
   */
  deleteAgentDispatch(dispatchId: string, roomName: string): Promise<void>;
}