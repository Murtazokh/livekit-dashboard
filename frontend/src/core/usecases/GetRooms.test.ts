import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetRooms, type RoomFilters } from './GetRooms';
import type { ILiveKitService } from '../ports/ILiveKitService';
import {
  activeRoom,
  closedRoom,
  roomWithParticipants,
  emptyRoom,
  roomWithSpecialChars,
} from '@/test/__fixtures__';

// Mock ILiveKitService
const createMockLiveKitService = (): ILiveKitService => ({
  initialize: vi.fn(),
  listRooms: vi.fn(),
  getRoomDetails: vi.fn(),
  listParticipants: vi.fn(),
  getAgents: vi.fn(),
  generateRoomToken: vi.fn(),
});

describe('GetRooms Use Case', () => {
  let mockService: ILiveKitService;
  let getRooms: GetRooms;

  beforeEach(() => {
    mockService = createMockLiveKitService();
    getRooms = new GetRooms(mockService);
  });

  describe('execute', () => {
    describe('Happy Path', () => {
      it('should return rooms from service', async () => {
        // Arrange
        const expectedRooms = [activeRoom, closedRoom];
        vi.mocked(mockService.listRooms).mockResolvedValue(expectedRooms);

        // Act
        const rooms = await getRooms.execute();

        // Assert
        expect(rooms).toEqual(expectedRooms);
      });

      it('should call listRooms on service', async () => {
        // Arrange
        vi.mocked(mockService.listRooms).mockResolvedValue([]);

        // Act
        await getRooms.execute();

        // Assert
        expect(mockService.listRooms).toHaveBeenCalledTimes(1);
      });

      it('should return empty array when no rooms exist', async () => {
        // Arrange
        vi.mocked(mockService.listRooms).mockResolvedValue([]);

        // Act
        const rooms = await getRooms.execute();

        // Assert
        expect(rooms).toEqual([]);
        expect(rooms).toHaveLength(0);
      });

      it('should return all rooms without modification', async () => {
        // Arrange
        const expectedRooms = [
          activeRoom,
          closedRoom,
          roomWithParticipants,
          emptyRoom,
          roomWithSpecialChars,
        ];
        vi.mocked(mockService.listRooms).mockResolvedValue(expectedRooms);

        // Act
        const rooms = await getRooms.execute();

        // Assert
        expect(rooms).toHaveLength(5);
        expect(rooms).toEqual(expectedRooms);
      });
    });

    describe('Error Handling', () => {
      it('should throw error when service fails', async () => {
        // Arrange
        const error = new Error('Service error');
        vi.mocked(mockService.listRooms).mockRejectedValue(error);

        // Act & Assert
        await expect(getRooms.execute()).rejects.toThrow(
          'Failed to retrieve rooms: Service error'
        );
      });

      it('should log error when service fails', async () => {
        // Arrange
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const error = new Error('Service error');
        vi.mocked(mockService.listRooms).mockRejectedValue(error);

        // Act
        await expect(getRooms.execute()).rejects.toThrow();

        // Assert
        expect(consoleSpy).toHaveBeenCalledWith('Failed to get rooms:', error);
        consoleSpy.mockRestore();
      });

      it('should handle non-Error objects', async () => {
        // Arrange
        vi.mocked(mockService.listRooms).mockRejectedValue('String error');

        // Act & Assert
        await expect(getRooms.execute()).rejects.toThrow(
          'Failed to retrieve rooms: Unknown error'
        );
      });

      it('should handle null error', async () => {
        // Arrange
        vi.mocked(mockService.listRooms).mockRejectedValue(null);

        // Act & Assert
        await expect(getRooms.execute()).rejects.toThrow(
          'Failed to retrieve rooms: Unknown error'
        );
      });
    });
  });

  describe('executeWithFilters', () => {
    beforeEach(() => {
      // Set up default room data for filtering tests
      vi.mocked(mockService.listRooms).mockResolvedValue([
        activeRoom, // 5 participants
        closedRoom, // 0 participants
        roomWithParticipants, // 10 participants
        emptyRoom, // 0 participants
      ]);
    });

    describe('No Filters', () => {
      it('should return all rooms when no filters provided', async () => {
        // Act
        const rooms = await getRooms.executeWithFilters();

        // Assert
        expect(rooms).toHaveLength(4);
      });

      it('should return all rooms when filters is undefined', async () => {
        // Act
        const rooms = await getRooms.executeWithFilters(undefined);

        // Assert
        expect(rooms).toHaveLength(4);
      });

      it('should return all rooms when filters is empty object', async () => {
        // Act
        const rooms = await getRooms.executeWithFilters({});

        // Assert
        expect(rooms).toHaveLength(4);
      });
    });

    describe('hasParticipants Filter', () => {
      it('should filter rooms with participants when hasParticipants=true', async () => {
        // Arrange
        const filters: RoomFilters = { hasParticipants: true };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(2);
        expect(rooms).toContainEqual(activeRoom);
        expect(rooms).toContainEqual(roomWithParticipants);
        expect(rooms).not.toContainEqual(closedRoom);
        expect(rooms).not.toContainEqual(emptyRoom);
      });

      it('should filter rooms without participants when hasParticipants=false', async () => {
        // Arrange
        const filters: RoomFilters = { hasParticipants: false };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(2);
        expect(rooms).toContainEqual(closedRoom);
        expect(rooms).toContainEqual(emptyRoom);
        expect(rooms).not.toContainEqual(activeRoom);
        expect(rooms).not.toContainEqual(roomWithParticipants);
      });
    });

    describe('minParticipants Filter', () => {
      it('should filter rooms with minimum participants', async () => {
        // Arrange
        const filters: RoomFilters = { minParticipants: 5 };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(2);
        expect(rooms).toContainEqual(activeRoom); // 5 participants
        expect(rooms).toContainEqual(roomWithParticipants); // 10 participants
      });

      it('should include rooms with exact minimum participants', async () => {
        // Arrange
        const filters: RoomFilters = { minParticipants: 10 };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(1);
        expect(rooms).toContainEqual(roomWithParticipants); // exactly 10
      });

      it('should return empty array when minParticipants exceeds all rooms', async () => {
        // Arrange
        const filters: RoomFilters = { minParticipants: 100 };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(0);
      });

      it('should return all rooms when minParticipants is 0', async () => {
        // Arrange
        const filters: RoomFilters = { minParticipants: 0 };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(4);
      });
    });

    describe('maxParticipants Filter', () => {
      it('should filter rooms with maximum participants', async () => {
        // Arrange
        const filters: RoomFilters = { maxParticipants: 5 };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(3);
        expect(rooms).toContainEqual(activeRoom); // 5 participants
        expect(rooms).toContainEqual(closedRoom); // 0 participants
        expect(rooms).toContainEqual(emptyRoom); // 0 participants
        expect(rooms).not.toContainEqual(roomWithParticipants); // 10 participants
      });

      it('should include rooms with exact maximum participants', async () => {
        // Arrange
        const filters: RoomFilters = { maxParticipants: 5 };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toContainEqual(activeRoom); // exactly 5
      });

      it('should return empty array when maxParticipants is less than all rooms', async () => {
        // Arrange
        vi.mocked(mockService.listRooms).mockResolvedValue([
          activeRoom,
          roomWithParticipants,
        ]);
        const filters: RoomFilters = { maxParticipants: 1 };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(0);
      });
    });

    describe('namePattern Filter', () => {
      it('should filter rooms by name pattern (case-insensitive)', async () => {
        // Arrange
        vi.mocked(mockService.listRooms).mockResolvedValue([
          activeRoom, // "test-room"
          closedRoom, // "closed-room"
          roomWithParticipants, // "room-with-participants"
        ]);
        const filters: RoomFilters = { namePattern: 'test' };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(1);
        expect(rooms[0].name).toBe('test-room');
      });

      it('should match partial name patterns', async () => {
        // Arrange
        vi.mocked(mockService.listRooms).mockResolvedValue([
          activeRoom, // "test-room"
          closedRoom, // "closed-room"
          roomWithParticipants, // "room-with-participants"
        ]);
        const filters: RoomFilters = { namePattern: 'room' };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(3);
      });

      it('should be case-insensitive', async () => {
        // Arrange
        vi.mocked(mockService.listRooms).mockResolvedValue([activeRoom]);
        const filters: RoomFilters = { namePattern: 'TEST' };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(1);
        expect(rooms[0]).toEqual(activeRoom);
      });

      it('should return empty array when pattern does not match', async () => {
        // Arrange
        const filters: RoomFilters = { namePattern: 'nonexistent' };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(0);
      });

      it('should match special characters in room names', async () => {
        // Arrange
        vi.mocked(mockService.listRooms).mockResolvedValue([
          roomWithSpecialChars, // "test room with spaces & special-chars"
        ]);
        const filters: RoomFilters = { namePattern: 'special-chars' };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(1);
        expect(rooms[0]).toEqual(roomWithSpecialChars);
      });
    });

    describe('Combined Filters', () => {
      it('should apply multiple filters together (AND logic)', async () => {
        // Arrange
        const filters: RoomFilters = {
          hasParticipants: true,
          minParticipants: 5,
          namePattern: 'room',
        };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(2);
        expect(rooms).toContainEqual(activeRoom); // 5 participants, "test-room"
        expect(rooms).toContainEqual(roomWithParticipants); // 10 participants, "room-with-participants"
      });

      it('should return empty when combined filters match nothing', async () => {
        // Arrange
        const filters: RoomFilters = {
          hasParticipants: true,
          maxParticipants: 3,
        };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(0);
      });

      it('should apply min and max participants together', async () => {
        // Arrange
        const filters: RoomFilters = {
          minParticipants: 5,
          maxParticipants: 10,
        };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(2);
        expect(rooms).toContainEqual(activeRoom); // 5
        expect(rooms).toContainEqual(roomWithParticipants); // 10
      });

      it('should handle all filters combined', async () => {
        // Arrange
        const filters: RoomFilters = {
          hasParticipants: true,
          minParticipants: 5,
          maxParticipants: 10,
          namePattern: 'test',
        };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(1);
        expect(rooms[0]).toEqual(activeRoom);
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty rooms array with filters', async () => {
        // Arrange
        vi.mocked(mockService.listRooms).mockResolvedValue([]);
        const filters: RoomFilters = { hasParticipants: true };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(0);
      });

      it('should handle service error', async () => {
        // Arrange
        vi.mocked(mockService.listRooms).mockRejectedValue(
          new Error('Service error')
        );
        const filters: RoomFilters = { hasParticipants: true };

        // Act & Assert
        await expect(getRooms.executeWithFilters(filters)).rejects.toThrow(
          'Failed to retrieve rooms'
        );
      });

      it('should handle empty string namePattern', async () => {
        // Arrange
        const filters: RoomFilters = { namePattern: '' };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(4); // empty string matches all
      });

      it('should handle negative minParticipants', async () => {
        // Arrange
        const filters: RoomFilters = { minParticipants: -1 };

        // Act
        const rooms = await getRooms.executeWithFilters(filters);

        // Assert
        expect(rooms).toHaveLength(4); // all rooms have >= -1
      });
    });
  });
});
