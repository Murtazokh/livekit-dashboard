import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LocalStorageConfig } from './LocalStorageConfig';
import { validConfig, invalidConfigMissingUrl, invalidConfigMissingKey, invalidConfigMissingSecret } from '@/test/__fixtures__';

describe('LocalStorageConfig', () => {
  let storage: LocalStorageConfig;
  const TEST_KEY = 'test-config-key';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    storage = new LocalStorageConfig(TEST_KEY);

    // Spy on console methods to verify logging
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('saveConfig', () => {
    describe('Happy Path', () => {
      it('should save valid config to localStorage', async () => {
        // Arrange
        const setItemSpy = vi.spyOn(localStorage, 'setItem');

        // Act
        await storage.saveConfig(validConfig);

        // Assert
        expect(setItemSpy).toHaveBeenCalledWith(
          TEST_KEY,
          JSON.stringify(validConfig)
        );
      });

      it('should save config that can be retrieved', async () => {
        // Arrange & Act
        await storage.saveConfig(validConfig);
        const retrieved = await storage.loadConfig();

        // Assert
        expect(retrieved).toEqual(validConfig);
      });

      it('should log safe config without secret', async () => {
        // Arrange
        const logSpy = console.log as ReturnType<typeof vi.spyOn>;

        // Act
        await storage.saveConfig(validConfig);

        // Assert
        expect(logSpy).toHaveBeenCalledWith(
          'Saving configuration:',
          expect.objectContaining({
            serverUrl: validConfig.serverUrl,
            apiKey: validConfig.apiKey,
            apiSecret: '[REDACTED]',
          })
        );
      });
    });

    describe('Validation', () => {
      it('should reject config with missing serverUrl', async () => {
        // Act & Assert
        await expect(storage.saveConfig(invalidConfigMissingUrl)).rejects.toThrow(
          'Invalid configuration: serverUrl, apiKey, and apiSecret are required'
        );
      });

      it('should reject config with missing apiKey', async () => {
        // Act & Assert
        await expect(storage.saveConfig(invalidConfigMissingKey)).rejects.toThrow(
          'Invalid configuration: serverUrl, apiKey, and apiSecret are required'
        );
      });

      it('should reject config with missing apiSecret', async () => {
        // Act & Assert
        await expect(storage.saveConfig(invalidConfigMissingSecret)).rejects.toThrow(
          'Invalid configuration: serverUrl, apiKey, and apiSecret are required'
        );
      });

      it('should not save invalid config to localStorage', async () => {
        // Arrange
        const setItemSpy = vi.spyOn(localStorage, 'setItem');

        // Act
        await expect(storage.saveConfig(invalidConfigMissingUrl)).rejects.toThrow();

        // Assert
        expect(setItemSpy).not.toHaveBeenCalled();
      });
    });

    describe('Error Handling', () => {
      it('should handle localStorage quota exceeded error', async () => {
        // Arrange
        const error = new Error('QuotaExceededError');
        vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
          throw error;
        });

        // Act & Assert
        await expect(storage.saveConfig(validConfig)).rejects.toThrow(
          'Failed to save configuration: QuotaExceededError'
        );
      });

      it('should log error when save fails', async () => {
        // Arrange
        const error = new Error('Storage error');
        vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
          throw error;
        });
        const errorSpy = console.error as ReturnType<typeof vi.spyOn>;

        // Act
        await expect(storage.saveConfig(validConfig)).rejects.toThrow();

        // Assert
        expect(errorSpy).toHaveBeenCalledWith(
          'Failed to save configuration:',
          expect.any(Error)
        );
      });
    });
  });

  describe('loadConfig', () => {
    describe('Happy Path', () => {
      it('should load config from localStorage', async () => {
        // Arrange
        await storage.saveConfig(validConfig);

        // Act
        const loaded = await storage.loadConfig();

        // Assert
        expect(loaded).toEqual(validConfig);
      });

      it('should return null when no config exists', async () => {
        // Act
        const loaded = await storage.loadConfig();

        // Assert
        expect(loaded).toBeNull();
      });

      it('should call localStorage.getItem with correct key', async () => {
        // Arrange
        const getItemSpy = vi.spyOn(localStorage, 'getItem');

        // Act
        await storage.loadConfig();

        // Assert
        expect(getItemSpy).toHaveBeenCalledWith(TEST_KEY);
      });
    });

    describe('Error Handling - Corrupted Data', () => {
      it('should handle corrupted JSON data', async () => {
        // Arrange
        localStorage.setItem(TEST_KEY, 'invalid-json{]');

        // Act
        const loaded = await storage.loadConfig();

        // Assert
        expect(loaded).toBeNull();
      });

      it('should clear storage when JSON parsing fails', async () => {
        // Arrange
        localStorage.setItem(TEST_KEY, 'invalid-json');
        const removeItemSpy = vi.spyOn(localStorage, 'removeItem');

        // Act
        await storage.loadConfig();

        // Assert
        expect(removeItemSpy).toHaveBeenCalledWith(TEST_KEY);
      });

      it('should log error when parsing fails', async () => {
        // Arrange
        localStorage.setItem(TEST_KEY, 'invalid-json');
        const errorSpy = console.error as ReturnType<typeof vi.spyOn>;

        // Act
        await storage.loadConfig();

        // Assert
        expect(errorSpy).toHaveBeenCalledWith(
          'Failed to load configuration:',
          expect.any(Error)
        );
      });
    });

    describe('Validation on Load', () => {
      it('should clear and return null for config missing serverUrl', async () => {
        // Arrange
        localStorage.setItem(TEST_KEY, JSON.stringify(invalidConfigMissingUrl));
        const removeItemSpy = vi.spyOn(localStorage, 'removeItem');

        // Act
        const loaded = await storage.loadConfig();

        // Assert
        expect(loaded).toBeNull();
        expect(removeItemSpy).toHaveBeenCalledWith(TEST_KEY);
      });

      it('should clear and return null for config missing apiKey', async () => {
        // Arrange
        localStorage.setItem(TEST_KEY, JSON.stringify(invalidConfigMissingKey));

        // Act
        const loaded = await storage.loadConfig();

        // Assert
        expect(loaded).toBeNull();
      });

      it('should clear and return null for config missing apiSecret', async () => {
        // Arrange
        localStorage.setItem(TEST_KEY, JSON.stringify(invalidConfigMissingSecret));

        // Act
        const loaded = await storage.loadConfig();

        // Assert
        expect(loaded).toBeNull();
      });

      it('should log warning when invalid config is loaded', async () => {
        // Arrange
        localStorage.setItem(TEST_KEY, JSON.stringify(invalidConfigMissingUrl));
        const warnSpy = console.warn as ReturnType<typeof vi.spyOn>;

        // Act
        await storage.loadConfig();

        // Assert
        expect(warnSpy).toHaveBeenCalledWith(
          'Invalid configuration loaded from storage, clearing it'
        );
      });
    });
  });

  describe('clearConfig', () => {
    describe('Happy Path', () => {
      it('should remove config from localStorage', async () => {
        // Arrange
        await storage.saveConfig(validConfig);
        const removeItemSpy = vi.spyOn(localStorage, 'removeItem');

        // Act
        await storage.clearConfig();

        // Assert
        expect(removeItemSpy).toHaveBeenCalledWith(TEST_KEY);
      });

      it('should make loadConfig return null after clear', async () => {
        // Arrange
        await storage.saveConfig(validConfig);

        // Act
        await storage.clearConfig();
        const loaded = await storage.loadConfig();

        // Assert
        expect(loaded).toBeNull();
      });

      it('should log success message', async () => {
        // Arrange
        const logSpy = console.log as ReturnType<typeof vi.spyOn>;

        // Act
        await storage.clearConfig();

        // Assert
        expect(logSpy).toHaveBeenCalledWith(
          'Configuration cleared from storage'
        );
      });
    });

    describe('Error Handling', () => {
      it('should handle localStorage.removeItem error', async () => {
        // Arrange
        const error = new Error('Storage error');
        vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
          throw error;
        });

        // Act & Assert
        await expect(storage.clearConfig()).rejects.toThrow(
          'Failed to clear configuration: Storage error'
        );
      });

      it('should log error when clear fails', async () => {
        // Arrange
        const error = new Error('Storage error');
        vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
          throw error;
        });
        const errorSpy = console.error as ReturnType<typeof vi.spyOn>;

        // Act
        await expect(storage.clearConfig()).rejects.toThrow();

        // Assert
        expect(errorSpy).toHaveBeenCalledWith(
          'Failed to clear configuration:',
          error
        );
      });
    });
  });

  describe('hasConfig', () => {
    describe('Happy Path', () => {
      it('should return true when valid config exists', async () => {
        // Arrange
        await storage.saveConfig(validConfig);

        // Act
        const hasConfig = await storage.hasConfig();

        // Assert
        expect(hasConfig).toBe(true);
      });

      it('should return false when no config exists', async () => {
        // Act
        const hasConfig = await storage.hasConfig();

        // Assert
        expect(hasConfig).toBe(false);
      });

      it('should return false after config is cleared', async () => {
        // Arrange
        await storage.saveConfig(validConfig);
        await storage.clearConfig();

        // Act
        const hasConfig = await storage.hasConfig();

        // Assert
        expect(hasConfig).toBe(false);
      });
    });

    describe('Error Handling', () => {
      it('should return false when loadConfig throws error', async () => {
        // Arrange
        localStorage.setItem(TEST_KEY, 'invalid-json');

        // Act
        const hasConfig = await storage.hasConfig();

        // Assert
        expect(hasConfig).toBe(false);
      });

      it('should return false for invalid stored config', async () => {
        // Arrange
        localStorage.setItem(TEST_KEY, JSON.stringify(invalidConfigMissingUrl));

        // Act
        const hasConfig = await storage.hasConfig();

        // Assert
        expect(hasConfig).toBe(false);
      });

      it('should log error when check fails', async () => {
        // Arrange
        vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
          throw new Error('Storage error');
        });
        const errorSpy = console.error as ReturnType<typeof vi.spyOn>;

        // Act
        await storage.hasConfig();

        // Assert
        // hasConfig calls loadConfig which logs "Failed to load configuration:"
        expect(errorSpy).toHaveBeenCalledWith(
          'Failed to load configuration:',
          expect.any(Error)
        );
      });
    });
  });

  describe('Custom Storage Key', () => {
    it('should use custom storage key when provided', async () => {
      // Arrange
      const customKey = 'custom-key';
      const customStorage = new LocalStorageConfig(customKey);
      const setItemSpy = vi.spyOn(localStorage, 'setItem');

      // Act
      await customStorage.saveConfig(validConfig);

      // Assert
      expect(setItemSpy).toHaveBeenCalledWith(
        customKey,
        expect.any(String)
      );
    });

    it('should use default key when not provided', async () => {
      // Arrange
      const defaultStorage = new LocalStorageConfig();
      const setItemSpy = vi.spyOn(localStorage, 'setItem');

      // Act
      await defaultStorage.saveConfig(validConfig);

      // Assert
      expect(setItemSpy).toHaveBeenCalledWith(
        'livekit-dashboard-config',
        expect.any(String)
      );
    });
  });

  describe('Security', () => {
    it('should redact apiSecret in logs during save', async () => {
      // Arrange
      const logSpy = console.log as ReturnType<typeof vi.spyOn>;

      // Act
      await storage.saveConfig(validConfig);

      // Assert
      const logCalls = logSpy.mock.calls;
      const safeConfigCall = logCalls.find(call =>
        call[0] === 'Saving configuration:'
      );
      expect(safeConfigCall).toBeDefined();
      expect(safeConfigCall![1]).toHaveProperty('apiSecret', '[REDACTED]');
    });

    it('should still store actual secret in localStorage', async () => {
      // Arrange
      await storage.saveConfig(validConfig);

      // Act
      const stored = localStorage.getItem(TEST_KEY);
      const parsed = JSON.parse(stored!);

      // Assert
      expect(parsed.apiSecret).toBe(validConfig.apiSecret);
      expect(parsed.apiSecret).not.toBe('[REDACTED]');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty localStorage', async () => {
      // Act
      const loaded = await storage.loadConfig();

      // Assert
      expect(loaded).toBeNull();
    });

    it('should handle multiple save operations', async () => {
      // Arrange
      const config1 = { ...validConfig, serverUrl: 'http://server1' };
      const config2 = { ...validConfig, serverUrl: 'http://server2' };

      // Act
      await storage.saveConfig(config1);
      await storage.saveConfig(config2);
      const loaded = await storage.loadConfig();

      // Assert
      expect(loaded).toEqual(config2);
    });

    it('should handle rapid save/load operations', async () => {
      // Act & Assert
      await storage.saveConfig(validConfig);
      const loaded1 = await storage.loadConfig();
      expect(loaded1).toEqual(validConfig);

      await storage.clearConfig();
      const loaded2 = await storage.loadConfig();
      expect(loaded2).toBeNull();

      await storage.saveConfig(validConfig);
      const loaded3 = await storage.loadConfig();
      expect(loaded3).toEqual(validConfig);
    });
  });
});
