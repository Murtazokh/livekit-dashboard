import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { extractLiveKitConfig, LiveKitConfig } from './extractLiveKitConfig';

describe('extractLiveKitConfig Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
    next = vi.fn();

    // Mock console.log
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Happy Path', () => {
    it('should extract config when all headers are present', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'http://localhost:7880',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig).toEqual({
        host: 'http://localhost:7880',
        apiKey: 'test-key',
        apiSecret: 'test-secret',
      });
    });

    it('should call next() after extraction', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'http://localhost:7880',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    it('should log successful extraction', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'http://localhost:7880',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'LiveKit config extracted successfully'
      );
    });
  });

  describe('WebSocket URL Conversion', () => {
    it('should convert wss:// to https://', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'wss://example.com',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig?.host).toBe('https://example.com');
    });

    it('should convert ws:// to http://', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'ws://localhost:7880',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig?.host).toBe('http://localhost:7880');
    });

    it('should preserve https:// URLs', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'https://example.com',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig?.host).toBe('https://example.com');
    });

    it('should preserve http:// URLs', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'http://localhost:7880',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig?.host).toBe('http://localhost:7880');
    });

    it('should handle wss:// with port', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'wss://example.com:443',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig?.host).toBe('https://example.com:443');
    });

    it('should handle ws:// with port', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'ws://localhost:7880',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig?.host).toBe('http://localhost:7880');
    });

    it('should handle wss:// with path', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'wss://example.com/livekit',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig?.host).toBe('https://example.com/livekit');
    });
  });

  describe('Fallback Behavior - Missing Headers', () => {
    it('should not set livekitConfig when host is missing', () => {
      // Arrange
      req.headers = {
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig).toBeUndefined();
    });

    it('should not set livekitConfig when apiKey is missing', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'http://localhost:7880',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig).toBeUndefined();
    });

    it('should not set livekitConfig when apiSecret is missing', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'http://localhost:7880',
        'x-livekit-key': 'test-key',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig).toBeUndefined();
    });

    it('should not set livekitConfig when all headers are missing', () => {
      // Arrange
      req.headers = {};

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig).toBeUndefined();
    });

    it('should call next() even when headers are missing', () => {
      // Arrange
      req.headers = {};

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should log when config not found in headers', () => {
      // Arrange
      req.headers = {};

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'LiveKit config not found in headers'
      );
    });
  });

  describe('Security - Logging', () => {
    it('should redact host in logs', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'http://secret-server.com',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      const extractingCall = consoleLogSpy.mock.calls.find(
        call => call[0] === 'Extracting LiveKit config:'
      );
      expect(extractingCall).toBeDefined();
      expect(extractingCall![1]).toHaveProperty('host', '[REDACTED]');
    });

    it('should not log actual apiKey', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'http://localhost:7880',
        'x-livekit-key': 'secret-key-123',
        'x-livekit-secret': 'secret-secret-456',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      const extractingCall = consoleLogSpy.mock.calls.find(
        call => call[0] === 'Extracting LiveKit config:'
      );
      expect(extractingCall![1]).toHaveProperty('hasApiKey', true);
      expect(extractingCall![1]).not.toHaveProperty('apiKey');
    });

    it('should not log actual apiSecret', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'http://localhost:7880',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'secret-secret-456',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      const extractingCall = consoleLogSpy.mock.calls.find(
        call => call[0] === 'Extracting LiveKit config:'
      );
      expect(extractingCall![1]).toHaveProperty('hasApiSecret', true);
      expect(extractingCall![1]).not.toHaveProperty('apiSecret');
    });

    it('should log boolean flags for key/secret presence', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'http://localhost:7880',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      const extractingCall = consoleLogSpy.mock.calls.find(
        call => call[0] === 'Extracting LiveKit config:'
      );
      expect(extractingCall![1]).toMatchObject({
        hasApiKey: true,
        hasApiSecret: true,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string headers', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': '',
        'x-livekit-key': '',
        'x-livekit-secret': '',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig).toBeUndefined();
    });

    it('should handle headers with whitespace', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': '  http://localhost:7880  ',
        'x-livekit-key': '  test-key  ',
        'x-livekit-secret': '  test-secret  ',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      // Should preserve whitespace (API will handle validation)
      expect(req.livekitConfig?.host).toBe('  http://localhost:7880  ');
    });

    it('should handle case-sensitive headers', () => {
      // Arrange
      req.headers = {
        'X-LiveKit-Host': 'http://localhost:7880', // Wrong case
        'X-LiveKit-Key': 'test-key',
        'X-LiveKit-Secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      // Express normalizes headers to lowercase, so this should work
      // But if we set them with wrong case, they won't be found
      expect(req.livekitConfig).toBeUndefined();
    });

    it('should handle request with no headers object', () => {
      // Arrange
      req.headers = undefined as any;

      // Act & Assert
      expect(() => {
        extractLiveKitConfig(req as Request, res as Response, next);
      }).toThrow();
    });

    it('should handle non-string header values', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'http://localhost:7880',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': ['array-value'] as any,
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      // Should treat array as truthy and try to use it
      expect(req.livekitConfig).toBeDefined();
    });
  });

  describe('Multiple Calls', () => {
    it('should override previous config on subsequent calls', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'http://server1.com',
        'x-livekit-key': 'key1',
        'x-livekit-secret': 'secret1',
      };

      // Act - First call
      extractLiveKitConfig(req as Request, res as Response, next);
      const firstConfig = req.livekitConfig;

      // Update headers
      req.headers = {
        'x-livekit-host': 'http://server2.com',
        'x-livekit-key': 'key2',
        'x-livekit-secret': 'secret2',
      };

      // Act - Second call
      extractLiveKitConfig(req as Request, res as Response, next);
      const secondConfig = req.livekitConfig;

      // Assert
      expect(firstConfig).not.toEqual(secondConfig);
      expect(secondConfig?.host).toBe('http://server2.com');
      expect(secondConfig?.apiKey).toBe('key2');
    });
  });

  describe('Protocol Handling', () => {
    it('should only replace wss:// at start of string', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'wss://example.com/wss://path',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig?.host).toBe('https://example.com/wss://path');
    });

    it('should only replace ws:// at start of string', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'ws://example.com/ws://path',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig?.host).toBe('http://example.com/ws://path');
    });

    it('should not convert wss: without //', () => {
      // Arrange
      req.headers = {
        'x-livekit-host': 'wss:example.com',
        'x-livekit-key': 'test-key',
        'x-livekit-secret': 'test-secret',
      };

      // Act
      extractLiveKitConfig(req as Request, res as Response, next);

      // Assert
      expect(req.livekitConfig?.host).toBe('wss:example.com');
    });
  });
});
