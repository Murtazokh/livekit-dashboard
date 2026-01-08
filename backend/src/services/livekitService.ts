import { RoomServiceClient } from 'livekit-server-sdk';
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
  startedAt: number;
  lastActivityAt: number;
}

export class LiveKitService {
  private roomClient: RoomServiceClient;
  private agentClient: AgentDispatchClient;

  constructor(config: ServerConfig) {
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
      return dispatches.map(dispatch => ({
        id: dispatch.id,
        name: dispatch.agentName,
        type: 'UNKNOWN', // SDK doesn't provide type info
        state: 'ACTIVE', // Assume active if dispatched
        roomName: dispatch.room, // Correct property name
        metadata: dispatch.metadata,
        startedAt: Date.now() / 1000,
        lastActivityAt: Date.now() / 1000,
      }));
    } catch (error) {
      console.error(`Error getting agents for room ${roomName}:`, error);
      throw new Error(`Failed to get agents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}