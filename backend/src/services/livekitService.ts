import { RoomServiceClient, AccessToken } from 'livekit-server-sdk';
import { AgentDispatchClient } from 'livekit-server-sdk';

export interface ServerConfig {
  host: string;
  apiKey: string;
  apiSecret: string;
}

export interface Room {
  sid: string;
  name: string;
  creationTime: number;
  numParticipants: number;
  numPublishers?: number;
  maxParticipants?: number;
  metadata?: string;
  emptyTimeout?: number;
  departureTimeout?: number;
  activeRecording?: boolean;
}

export interface Participant {
  sid: string;
  identity: string;
  name?: string;
  state: string;
  metadata?: string;
  joinedAt: number;
  isPublisher: boolean;
  tracks: any[]; // We'll define this later if needed
  permission?: any;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  state: string;
  roomName?: string;
  participantSid?: string;
  metadata?: string;
  config?: any; // Parsed configuration from metadata
  startedAt: number;
  lastActivityAt: number;
}

export class LiveKitService {
  private roomClient: RoomServiceClient;
  private agentClient: AgentDispatchClient;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
    this.roomClient = new RoomServiceClient(
      config.host,
      config.apiKey,
      config.apiSecret
    );
    this.agentClient = new AgentDispatchClient(
      config.host,
      config.apiKey,
      config.apiSecret
    );
  }

  async listRooms(): Promise<Room[]> {
    try {
      const rooms = await this.roomClient.listRooms();
      return rooms.map(room => ({
        sid: room.sid,
        name: room.name,
        creationTime: Number(room.creationTime / 1000n), // Convert BigInt milliseconds to seconds
        numParticipants: room.numParticipants,
        numPublishers: room.numPublishers,
        maxParticipants: room.maxParticipants,
        metadata: room.metadata,
        emptyTimeout: room.emptyTimeout,
        departureTimeout: room.departureTimeout,
        activeRecording: room.activeRecording,
      }));
    } catch (error) {
      console.error('Error listing rooms:', error);
      throw new Error(`Failed to list rooms: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRoomDetails(roomName: string): Promise<Room | null> {
    try {
      const rooms = await this.roomClient.listRooms([roomName]);
      if (rooms.length === 0) {
        return null;
      }
      const room = rooms[0];
      return {
        sid: room.sid,
        name: room.name,
        creationTime: Number(room.creationTime / 1000n), // Convert BigInt milliseconds to seconds
        numParticipants: room.numParticipants,
        numPublishers: room.numPublishers,
        maxParticipants: room.maxParticipants,
        metadata: room.metadata,
        emptyTimeout: room.emptyTimeout,
        departureTimeout: room.departureTimeout,
        activeRecording: room.activeRecording,
      };
    } catch (error) {
      console.error(`Error getting room details for ${roomName}:`, error);
      throw new Error(`Failed to get room details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listParticipants(roomName: string): Promise<Participant[]> {
    try {
      const participants = await this.roomClient.listParticipants(roomName);
      return participants.map(participant => ({
        sid: participant.sid,
        identity: participant.identity,
        name: participant.name,
        state: participant.state.toString(), // Convert enum to string
        metadata: participant.metadata,
        joinedAt: Number(participant.joinedAt / 1000n), // Convert BigInt milliseconds to seconds
        isPublisher: participant.isPublisher || false,
        tracks: participant.tracks || [],
        permission: participant.permission,
      }));
    } catch (error) {
      console.error(`Error listing participants for room ${roomName}:`, error);
      throw new Error(`Failed to list participants: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAgents(roomName?: string): Promise<Agent[]> {
    try {
      // Note: AgentDispatchClient.listDispatch requires roomName
      // For now, we'll return empty array if no roomName provided
      if (!roomName) {
        return [];
      }

      const dispatches = await this.agentClient.listDispatch(roomName);
      return dispatches.map(dispatch => {
        // Try to parse metadata as JSON to extract configuration
        let config = undefined;
        if (dispatch.metadata) {
          try {
            config = JSON.parse(dispatch.metadata);
          } catch (e) {
            // If metadata is not JSON, leave it as string
            console.debug('Agent metadata is not JSON:', dispatch.metadata);
          }
        }

        return {
          id: dispatch.id,
          name: dispatch.agentName,
          type: config?.type || 'UNKNOWN', // Try to get type from config
          state: 'ACTIVE', // Assume active if dispatched
          roomName: dispatch.room,
          metadata: dispatch.metadata,
          config, // Include parsed configuration
          startedAt: Date.now() / 1000,
          lastActivityAt: Date.now() / 1000,
        };
      });
    } catch (error) {
      console.error(`Error getting agents for room ${roomName}:`, error);
      throw new Error(`Failed to get agents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate JWT access token for client connection to a room
   * @param roomName - Name of the room to join
   * @param participantIdentity - Unique identifier for the participant
   * @param participantName - Display name for the participant
   * @returns JWT token string
   */
  async generateToken(
    roomName: string,
    participantIdentity: string,
    participantName?: string
  ): Promise<string> {
    try {
      const token = new AccessToken(
        this.config.apiKey,
        this.config.apiSecret,
        {
          identity: participantIdentity,
          name: participantName || participantIdentity,
        }
      );

      // Grant permissions to join the room
      token.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: false, // Dashboard viewers don't publish
        canSubscribe: true, // Can subscribe to tracks
        canPublishData: false,
      });

      return await token.toJwt();
    } catch (error) {
      console.error(`Error generating token for room ${roomName}:`, error);
      throw new Error(`Failed to generate token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create an agent dispatch for a specific room
   * @param roomName - Name of the room
   * @param agentName - Name of the agent to dispatch
   * @param metadata - Optional metadata for the agent
   * @returns The created dispatch object
   */
  async createAgentDispatch(
    roomName: string,
    agentName: string,
    metadata?: string
  ): Promise<{ id: string; agentName: string; room: string; metadata?: string }> {
    try {
      const dispatch = await this.agentClient.createDispatch(roomName, agentName, { metadata });
      return {
        id: dispatch.id,
        agentName: dispatch.agentName,
        room: dispatch.room,
        metadata: dispatch.metadata,
      };
    } catch (error) {
      console.error(`Error creating agent dispatch for room ${roomName}:`, error);
      throw new Error(`Failed to create agent dispatch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete an agent dispatch
   * @param dispatchId - ID of the dispatch to delete
   * @param roomName - Name of the room
   */
  async deleteAgentDispatch(dispatchId: string, roomName: string): Promise<void> {
    try {
      await this.agentClient.deleteDispatch(dispatchId, roomName);
    } catch (error) {
      console.error(`Error deleting agent dispatch ${dispatchId}:`, error);
      throw new Error(`Failed to delete agent dispatch: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all agent dispatches across all rooms
   * This is a helper method that lists dispatches for all active rooms
   * Also includes agent participants from rooms
   * @returns Array of all agent dispatches
   */
  async getAllAgentDispatches(): Promise<Agent[]> {
    try {
      // Get all rooms first
      const rooms = await this.listRooms();

      if (rooms.length === 0) {
        console.log('No active rooms found');
        return [];
      }

      // Get dispatches and participants for each room
      const allAgents: Agent[] = [];
      const seenAgentIds = new Set<string>();

      for (const room of rooms) {
        // Get explicit dispatches
        try {
          const dispatches = await this.getAgents(room.name);
          for (const dispatch of dispatches) {
            if (!seenAgentIds.has(dispatch.id)) {
              allAgents.push(dispatch);
              seenAgentIds.add(dispatch.id);
            }
          }
        } catch (dispatchError) {
          console.debug(`No dispatches for room ${room.name}:`, dispatchError);
        }

        // Also check participants for agents (agents join as special participants)
        try {
          const participants = await this.listParticipants(room.name);
          for (const participant of participants) {
            // Agent participants typically have metadata indicating they're agents
            // or their identity follows a pattern like "agent-*"
            const isAgent =
              participant.identity.startsWith('agent-') ||
              participant.identity.startsWith('agent_') ||
              participant.name?.toLowerCase().includes('agent') ||
              (participant.metadata && participant.metadata.includes('agent'));

            if (isAgent && !seenAgentIds.has(participant.sid)) {
              // Convert participant to Agent format
              const agentFromParticipant: Agent = {
                id: participant.sid,
                name: participant.name || participant.identity,
                type: 'UNKNOWN',
                state: participant.state === 'ACTIVE' ? 'ACTIVE' : 'DISCONNECTED',
                roomName: room.name,
                participantSid: participant.sid,
                metadata: participant.metadata,
                startedAt: participant.joinedAt,
                lastActivityAt: participant.joinedAt,
              };

              // Try to parse metadata
              if (participant.metadata) {
                try {
                  agentFromParticipant.config = JSON.parse(participant.metadata);
                } catch (e) {
                  // Metadata not JSON
                }
              }

              allAgents.push(agentFromParticipant);
              seenAgentIds.add(participant.sid);
            }
          }
        } catch (participantError) {
          console.debug(`Error getting participants for room ${room.name}:`, participantError);
        }
      }

      return allAgents;
    } catch (error) {
      console.error('Error getting all agent dispatches:', error);
      throw new Error(`Failed to get all agent dispatches: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}