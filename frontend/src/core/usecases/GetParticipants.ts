import type { Participant } from '@/core/domain/Participant';
import type { ILiveKitService } from '@/core/ports/ILiveKitService';

/**
 * Use case for retrieving participants from a LiveKit room
 * Handles business logic for participant data fetching and processing
 */
export class GetParticipants {
  private livekitService: ILiveKitService;

  constructor(livekitService: ILiveKitService) {
    this.livekitService = livekitService;
  }

  /**
   * Execute the get participants operation for a specific room
   * @param roomName - Name of the room to get participants for
   * @returns Promise resolving to array of participants
   */
  async execute(roomName: string): Promise<Participant[]> {
    try {
      const participants = await this.livekitService.listParticipants(roomName);

      // Apply any business logic transformations here
      // For now, just return the participants as-is
      // Future: filtering, sorting, data enrichment

      return participants;
    } catch (error) {
      console.error(`Failed to get participants for room ${roomName}:`, error);
      throw new Error(`Failed to retrieve participants: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get participants with optional filtering
   * @param roomName - Name of the room
   * @param filters - Optional filters to apply
   * @returns Promise resolving to filtered array of participants
   */
  async executeWithFilters(roomName: string, filters?: ParticipantFilters): Promise<Participant[]> {
    const participants = await this.execute(roomName);

    if (!filters) {
      return participants;
    }

    return participants.filter(participant => {
      // Apply filters
      if (filters.isPublisher !== undefined && participant.isPublisher !== filters.isPublisher) {
        return false;
      }

      if (filters.state && participant.state !== filters.state) {
        return false;
      }

      if (filters.namePattern && !participant.identity.toLowerCase().includes(filters.namePattern.toLowerCase())) {
        return false;
      }

      if (filters.hasTracks !== undefined) {
        const hasTracks = participant.tracks && participant.tracks.length > 0;
        if (filters.hasTracks !== hasTracks) {
          return false;
        }
      }

      return true;
    });
  }
}

/**
 * Filters for participant queries
 */
export interface ParticipantFilters {
  /** Filter by publisher status */
  isPublisher?: boolean;

  /** Filter by participant state */
  state?: string;

  /** Pattern to match participant identity (case-insensitive) */
  namePattern?: string;

  /** Filter participants that have tracks */
  hasTracks?: boolean;
}