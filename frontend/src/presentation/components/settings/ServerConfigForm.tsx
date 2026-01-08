import React from 'react';
import type { ServerConfig } from '@/shared/types/config';

interface ServerConfigFormProps {
  config: ServerConfig;
  onConfigChange: (config: ServerConfig) => void;
  onSubmit: (config: ServerConfig) => Promise<void>;
  onTestConnection: (config: ServerConfig) => Promise<boolean>;
  isSaving: boolean;
  isValidating: boolean;
  error: string;
  success: string;
}

/**
 * Form component for configuring LiveKit server settings
 * Includes validation, connection testing, and user feedback
 */
export const ServerConfigForm: React.FC<ServerConfigFormProps> = ({
  config,
  onConfigChange,
  onSubmit,
  onTestConnection,
  isSaving,
  isValidating,
  error,
  success,
}) => {
  const handleInputChange = (field: keyof ServerConfig) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onConfigChange({
      ...config,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(config);
  };

  const handleTestConnection = async () => {
    await onTestConnection(config);
  };

  const isFormValid = config.serverUrl && config.apiKey && config.apiSecret;

  return (
        <div className="max-w-2xl mx-auto">
      <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m16.24-3.76l-4.24 4.24m-6-6L2.76 6.24m16.24 12.52l-4.24-4.24m-6 6L2.76 17.76"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Server Configuration</h2>
          </div>
          <p className="text-muted-foreground ml-11">
            Configure your LiveKit server connection details to start monitoring your rooms and participants.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Server URL Field */}
          <div className="space-y-2">
            <label htmlFor="serverUrl" className="text-sm font-medium leading-none">
              Server URL *
            </label>
            <div className="relative">
              <input
                id="serverUrl"
                type="url"
                placeholder="https://your-livekit-server.com"
                value={config.serverUrl}
                onChange={handleInputChange('serverUrl')}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              The URL of your LiveKit server (e.g., wss://your-project.livekit.cloud or ws://localhost:7880)
            </p>
          </div>

          {/* API Key Field */}
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium leading-none">
              API Key *
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type="password"
                placeholder="your-api-key"
                value={config.apiKey}
                onChange={handleInputChange('apiKey')}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors pr-10"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Your LiveKit API key for server authentication
            </p>
          </div>

          {/* API Secret Field */}
          <div className="space-y-2">
            <label htmlFor="apiSecret" className="text-sm font-medium leading-none">
              API Secret *
            </label>
            <div className="relative">
              <input
                id="apiSecret"
                type="password"
                placeholder="your-api-secret"
                value={config.apiSecret}
                onChange={handleInputChange('apiSecret')}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors pr-10"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Your LiveKit API secret for server authentication
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-md border border-green-500/50 bg-green-500/10 p-4 text-green-700 dark:text-green-400">
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
                <p className="text-sm font-medium">{success}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={!isFormValid || isSaving}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Configuration'
              )}
            </button>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={!isFormValid || isValidating}
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors"
            >
              {isValidating ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Security Note:</p>
            <p>Your API credentials are stored locally in your browser and are only sent to your LiveKit server for authentication. They are never transmitted to any third-party services.</p>
          </div>
        </div>
      </div>
    </div>
  );
};