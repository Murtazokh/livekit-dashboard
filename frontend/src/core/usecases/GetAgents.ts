import type { Agent } from '@/core/domain/Agent';
import type { ILiveKitService } from '@/core/ports/ILiveKitService';

/**
 * Use case for retrieving agents from a specific room
 * Handles business logic for agent data fetching and processing
 */
export class GetAgents {
  private livekitService: ILiveKitService;

  constructor(livekitService: ILiveKitService) {
    this.livekitService = livekitService;
  }

  /**
   * Execute the get agents operation for a specific room
   * @param roomName - Name of the room to get agents from
   * @returns Promise resolving to array of agents
   */
  async execute(roomName?: string): Promise<Agent[]> {
    try {
      const agents = await this.livekitService.getAgents(roomName);
      return agents;
    } catch (error) {
      console.error('Failed to get agents:', error);
      throw new Error(`Failed to retrieve agents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Use case for retrieving all agent dispatches across all rooms
 */
export class GetAllAgents {
  private livekitService: ILiveKitService;

  constructor(livekitService: ILiveKitService) {
    this.livekitService = livekitService;
  }

  /**
   * Execute the get all agents operation
   * @returns Promise resolving to array of all agent dispatches
   */
  async execute(): Promise<Agent[]> {
    try {
      const agents = await this.livekitService.getAllAgents();
      return agents;
    } catch (error) {
      console.error('Failed to get all agents:', error);
      throw new Error(`Failed to retrieve all agents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get agents with optional filtering
   * @param filters - Optional filters to apply
   * @returns Promise resolving to filtered array of agents
   */
  async executeWithFilters(filters?: AgentFilters): Promise<Agent[]> {
    const agents = await this.execute();

    if (!filters) {
      return agents;
    }

    return agents.filter(agent => {
      // Filter by room name
      if (filters.roomName && agent.roomName !== filters.roomName) {
        return false;
      }

      // Filter by agent type
      if (filters.type && agent.type !== filters.type) {
        return false;
      }

      // Filter by agent state
      if (filters.state && agent.state !== filters.state) {
        return false;
      }

      // Filter by agent name pattern
      if (filters.namePattern && !agent.name.toLowerCase().includes(filters.namePattern.toLowerCase())) {
        return false;
      }

      return true;
    });
  }
}

/**
 * Filters for agent queries
 */
export interface AgentFilters {
  /** Filter by room name */
  roomName?: string;

  /** Filter by agent type */
  type?: string;

  /** Filter by agent state */
  state?: string;

  /** Pattern to match agent names (case-insensitive) */
  namePattern?: string;
}
