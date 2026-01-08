import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { LocalStorageConfig } from '@/infrastructure/storage/LocalStorageConfig';
import type { ServerConfig } from '@/shared/types/config';

interface ApiClientContextType {
  apiClient: ApiClient;
  isInitialized: boolean;
}

const ApiClientContext = createContext<ApiClientContextType | undefined>(undefined);

export const useApiClient = () => {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error('useApiClient must be used within an ApiClientProvider');
  }
  return context;
};

interface ApiClientProviderProps {
  children: React.ReactNode;
}

export const ApiClientProvider: React.FC<ApiClientProviderProps> = ({ children }) => {
  const [apiClient] = useState(() => new ApiClient());
  const [isInitialized, setIsInitialized] = useState(false);
  const [config, setConfig] = useState<ServerConfig | null>(null);

  // Load config on mount
  useEffect(() => {
    const configStorage = new LocalStorageConfig();
    const loadConfig = async () => {
      const savedConfig = await configStorage.loadConfig();
      setConfig(savedConfig);
    };
    loadConfig();
  }, []);

  // Initialize ApiClient when config is available
  useEffect(() => {
    if (config) {
      console.log('Initializing ApiClient with config:', {
        serverUrl: config.serverUrl,
        hasApiKey: !!config.apiKey,
        hasApiSecret: !!config.apiSecret,
      });
      apiClient.initialize(config);
      setIsInitialized(true);
    } else {
      setIsInitialized(false);
    }
  }, [apiClient, config]);

  return (
    <ApiClientContext.Provider value={{ apiClient, isInitialized }}>
      {children}
    </ApiClientContext.Provider>
  );
};