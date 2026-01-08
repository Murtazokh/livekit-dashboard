import type { Room } from '@/core/domain/Room';
import type { ILiveKitService } from '@/core/ports/ILiveKitService';

/**
 * Use case for retrieving rooms from LiveKit server
 * Handles business logic for room data fetching and processing
 */
export class GetRooms {
  private livekitService: ILiveKitService;

  constructor(livekitService: ILiveKitService) {
    this.livekitService = livekitService;
  }

  /**
   * Execute the get rooms operation
   * @returns Promise resolving to array of rooms
   */
  async execute(): Promise<Room[]> {
    try {
      const rooms = await this.livekitService.listRooms();

      // Apply any business logic transformations here
      // For now, just return the rooms as-is
      // Future: filtering, sorting, data enrichment

      return rooms;
    } catch (error) {
      console.error('Failed to get rooms:', error);
      throw new Error(`Failed to retrieve rooms: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get rooms with optional filtering
   * @param filters - Optional filters to apply
   * @returns Promise resolving to filtered array of rooms
   */
  async executeWithFilters(filters?: RoomFilters): Promise<Room[]> {
    const rooms = await this.execute();

    if (!filters) {
      return rooms;
    }

    return rooms.filter(room => {
      // Apply filters
      if (filters.hasParticipants !== undefined) {
        if (filters.hasParticipants && room.numParticipants === 0) {
          return false;
        }
        if (!filters.hasParticipants && room.numParticipants > 0) {
          return false;
        }
      }

      if (filters.minParticipants !== undefined && room.numParticipants < filters.minParticipants) {
        return false;
      }

      if (filters.maxParticipants !== undefined && room.numParticipants > filters.maxParticipants) {
        return false;
      }

      if (filters.namePattern && !room.name.toLowerCase().includes(filters.namePattern.toLowerCase())) {
        return false;
      }

      return true;
    });
  }
}

/**
 * Filters for room queries
 */
export interface RoomFilters {
  /** Filter rooms that have participants */
  hasParticipants?: boolean;

  /** Minimum number of participants */
  minParticipants?: number;

  /** Maximum number of participants */
  maxParticipants?: number;

  /** Pattern to match room names (case-insensitive) */
  namePattern?: string;
}