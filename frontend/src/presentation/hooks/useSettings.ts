import { useState, useEffect } from 'react';
import type { ServerConfig } from '@/shared/types/config';
import type { IConfigStorage } from '@/core/ports/IConfigStorage';
import { LocalStorageConfig } from '@/infrastructure/storage/LocalStorageConfig';
import { ValidateConnection } from '@/core/usecases/ValidateConnection';
import { useApiClient } from '../providers/ApiClientProvider';

/**
 * Custom hook for managing LiveKit server settings
 * Handles configuration storage, validation, and connection testing
 */
export const useSettings = () => {
  const [config, setConfig] = useState<ServerConfig>({
    serverUrl: '',
    apiKey: '',
    apiSecret: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Initialize services
  const configStorage: IConfigStorage = new LocalStorageConfig();
  const { apiClient } = useApiClient();
  const validateConnection = new ValidateConnection(apiClient);

  // Load configuration on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedConfig = await configStorage.loadConfig();
        if (savedConfig) {
          setConfig(savedConfig);
        }
      } catch (err) {
        console.error('Failed to load configuration:', err);
        setError('Failed to load saved configuration');
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Clear messages when config changes
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [config]);

  /**
   * Save configuration to storage
   */
  const saveConfig = async (newConfig: ServerConfig) => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await configStorage.saveConfig(newConfig);
      setConfig(newConfig);
      setSuccess('Configuration saved successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save configuration';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Validate connection to LiveKit server
   */
  const testConnection = async (testConfig?: ServerConfig) => {
    const configToTest = testConfig || config;
    setIsValidating(true);
    setError('');
    setSuccess('');

    try {
      const result = await validateConnection.execute(configToTest);

      if (result.valid) {
        setSuccess('Connection successful! Server is reachable.');
        return true;
      } else {
        setError(result.message);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Update configuration and optionally save
   */
  const updateConfig = (updates: Partial<ServerConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  /**
   * Clear all configuration
   */
  const clearConfig = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await configStorage.clearConfig();
      setConfig({
        serverUrl: '',
        apiKey: '',
        apiSecret: '',
      });
      setSuccess('Configuration cleared');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear configuration';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Check if configuration is complete
   */
  const isConfigComplete = () => {
    return !!(config.serverUrl && config.apiKey && config.apiSecret);
  };

  return {
    config,
    isLoading,
    isSaving,
    isValidating,
    error,
    success,
    saveConfig,
    testConnection,
    updateConfig,
    clearConfig,
    isConfigComplete,
  };
};