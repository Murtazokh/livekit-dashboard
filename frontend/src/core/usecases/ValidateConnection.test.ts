import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValidateConnection } from './ValidateConnection';
import type { ILiveKitService } from '../ports/ILiveKitService';
import { validConfig } from '@/test/__fixtures__';

// Mock ILiveKitService
const createMockLiveKitService = (): ILiveKitService => ({
  initialize: vi.fn(),
  listRooms: vi.fn(),
  getRoomDetails: vi.fn(),
  listParticipants: vi.fn(),
  getAgents: vi.fn(),
  generateRoomToken: vi.fn(),
});

describe('ValidateConnection Use Case', () => {
  let mockService: ILiveKitService;
  let validateConnection: ValidateConnection;

  beforeEach(() => {
    mockService = createMockLiveKitService();
    validateConnection = new ValidateConnection(mockService);
  });

  describe('Happy Path', () => {
    it('should return valid=true when connection is successful', async () => {
      // Arrange
      vi.mocked(mockService.listRooms).mockResolvedValue([]);

      // Act
      const result = await validateConnection.execute(validConfig);

      // Assert
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Connection successful');
      expect(result.error).toBeUndefined();
    });

    it('should initialize the service with provided config', async () => {
      // Arrange
      vi.mocked(mockService.listRooms).mockResolvedValue([]);

      // Act
      await validateConnection.execute(validConfig);

      // Assert
      expect(mockService.initialize).toHaveBeenCalledWith(validConfig);
      expect(mockService.initialize).toHaveBeenCalledTimes(1);
    });

    it('should call listRooms to test connection', async () => {
      // Arrange
      vi.mocked(mockService.listRooms).mockResolvedValue([]);

      // Act
      await validateConnection.execute(validConfig);

      // Assert
      expect(mockService.listRooms).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling - Invalid Credentials', () => {
    it('should return user-friendly message for unauthorized error', async () => {
      // Arrange
      const error = new Error('Unauthorized: Invalid API credentials');
      vi.mocked(mockService.listRooms).mockRejectedValue(error);

      // Act
      const result = await validateConnection.execute(validConfig);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.message).toBe(
        'Invalid API credentials. Please check your API key and secret.'
      );
      expect(result.error).toBe(error);
    });

    it('should return user-friendly message for 403 error', async () => {
      // Arrange
      const error = new Error('403 Forbidden');
      vi.mocked(mockService.listRooms).mockRejectedValue(error);

      // Act
      const result = await validateConnection.execute(validConfig);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.message).toBe(
        'Invalid API credentials. Please check your API key and secret.'
      );
    });
  });

  describe('Error Handling - Network Errors', () => {
    it('should return user-friendly message for network error', async () => {
      // Arrange
      const error = new Error('Network request failed');
      vi.mocked(mockService.listRooms).mockRejectedValue(error);

      // Act
      const result = await validateConnection.execute(validConfig);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.message).toBe(
        'Unable to connect to the LiveKit server. Please check the server URL and network connectivity.'
      );
      expect(result.error).toBe(error);
    });

    it('should return user-friendly message for fetch error', async () => {
      // Arrange
      const error = new Error('Failed to fetch');
      vi.mocked(mockService.listRooms).mockRejectedValue(error);

      // Act
      const result = await validateConnection.execute(validConfig);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Unable to connect');
    });
  });

  describe('Error Handling - Timeout Errors', () => {
    it('should return user-friendly message for timeout error', async () => {
      // Arrange
      const error = new Error('Request timeout exceeded');
      vi.mocked(mockService.listRooms).mockRejectedValue(error);

      // Act
      const result = await validateConnection.execute(validConfig);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.message).toBe(
        'Connection timed out. Please check your network connection and server availability.'
      );
    });
  });

  describe('Error Handling - DNS Errors', () => {
    it('should return user-friendly message for DNS error', async () => {
      // Arrange
      const error = new Error('DNS lookup failed');
      vi.mocked(mockService.listRooms).mockRejectedValue(error);

      // Act
      const result = await validateConnection.execute(validConfig);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.message).toBe(
        'Server URL could not be resolved. Please check the server address.'
      );
    });

    it('should return user-friendly message for resolve error', async () => {
      // Arrange
      const error = new Error('Could not resolve hostname');
      vi.mocked(mockService.listRooms).mockRejectedValue(error);

      // Act
      const result = await validateConnection.execute(validConfig);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.message).toContain('could not be resolved');
    });
  });

  describe('Error Handling - Unknown Errors', () => {
    it('should handle non-Error objects', async () => {
      // Arrange
      vi.mocked(mockService.listRooms).mockRejectedValue('String error');

      // Act
      const result = await validateConnection.execute(validConfig);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.message).toBe(
        'An unexpected error occurred during connection validation.'
      );
      expect(result.error).toBeDefined();
    });

    it('should handle null error', async () => {
      // Arrange
      vi.mocked(mockService.listRooms).mockRejectedValue(null);

      // Act
      const result = await validateConnection.execute(validConfig);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.message).toBe(
        'An unexpected error occurred during connection validation.'
      );
    });

    it('should return original message for unknown Error types', async () => {
      // Arrange
      const error = new Error('Some specific error message');
      vi.mocked(mockService.listRooms).mockRejectedValue(error);

      // Act
      const result = await validateConnection.execute(validConfig);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Some specific error message');
    });
  });

  describe('Edge Cases', () => {
    it('should handle service that throws during initialization', async () => {
      // Arrange
      const error = new Error('Initialization failed');
      vi.mocked(mockService.initialize).mockImplementation(() => {
        throw error;
      });

      // Act
      const result = await validateConnection.execute(validConfig);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toBe(error);
    });

    it('should handle empty error message', async () => {
      // Arrange
      const error = new Error('');
      vi.mocked(mockService.listRooms).mockRejectedValue(error);

      // Act
      const result = await validateConnection.execute(validConfig);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.message).toBe('');
    });
  });
});
