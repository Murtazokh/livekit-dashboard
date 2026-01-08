import type { ServerConfig } from '../../shared/types/config';
import type { IConfigStorage } from '../../core/ports/IConfigStorage';

const CONFIG_STORAGE_KEY = 'livekit-dashboard-config';

/**
 * Local storage implementation of configuration storage
 * Uses browser's localStorage to persist server configuration
 */
export class LocalStorageConfig implements IConfigStorage {
  private readonly storageKey: string;

  constructor(storageKey: string = CONFIG_STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  async saveConfig(config: ServerConfig): Promise<void> {
    try {
      // Basic validation
      if (!config.serverUrl || !config.apiKey || !config.apiSecret) {
        throw new Error('Invalid configuration: serverUrl, apiKey, and apiSecret are required');
      }

      // Create a copy without sensitive data for logging (optional)
      const safeConfig = {
        ...config,
        apiSecret: '[REDACTED]',
      };

      console.log('Saving configuration:', safeConfig);

      // Store in localStorage
      const configJson = JSON.stringify(config);
      localStorage.setItem(this.storageKey, configJson);
    } catch (error) {
      console.error('Failed to save configuration:', error);
      throw new Error(`Failed to save configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async loadConfig(): Promise<ServerConfig | null> {
    try {
      const configJson = localStorage.getItem(this.storageKey);

      if (!configJson) {
        return null;
      }

      const config = JSON.parse(configJson) as ServerConfig;

      // Basic validation of loaded config
      if (!config.serverUrl || !config.apiKey || !config.apiSecret) {
        console.warn('Invalid configuration loaded from storage, clearing it');
        await this.clearConfig();
        return null;
      }

      return config;
    } catch (error) {
      console.error('Failed to load configuration:', error);
      // If parsing fails, clear the corrupted data
      await this.clearConfig();
      return null;
    }
  }

  async clearConfig(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('Configuration cleared from storage');
    } catch (error) {
      console.error('Failed to clear configuration:', error);
      throw new Error(`Failed to clear configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async hasConfig(): Promise<boolean> {
    try {
      const config = await this.loadConfig();
      return config !== null;
    } catch (error) {
      console.error('Failed to check configuration existence:', error);
      return false;
    }
  }
}