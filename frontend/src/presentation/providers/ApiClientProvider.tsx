import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { useSettings } from '../hooks/useSettings';

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
  const { config, isConfigComplete } = useSettings();
  const [apiClient] = useState(() => new ApiClient());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isConfigComplete() && config) {
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
  }, [apiClient, config, isConfigComplete]);

  return (
    <ApiClientContext.Provider value={{ apiClient, isInitialized }}>
      {children}
    </ApiClientContext.Provider>
  );
};