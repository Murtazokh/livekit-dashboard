import type { ServerConfig } from '../../shared/types/config';

/**
 * Interface for configuration storage operations
 * Defines the contract for persisting and retrieving server configuration
 */
export interface IConfigStorage {
  /**
   * Save server configuration to storage
   * @param config - Server configuration to save
   * @returns Promise that resolves when save is complete
   */
  saveConfig(config: ServerConfig): Promise<void>;

  /**
   * Load server configuration from storage
   * @returns Promise resolving to stored configuration or null if not found
   */
  loadConfig(): Promise<ServerConfig | null>;

  /**
   * Clear stored server configuration
   * @returns Promise that resolves when configuration is cleared
   */
  clearConfig(): Promise<void>;

  /**
   * Check if configuration exists in storage
   * @returns Promise resolving to true if configuration exists
   */
  hasConfig(): Promise<boolean>;
}