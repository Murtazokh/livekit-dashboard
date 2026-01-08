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
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">LiveKit Server Configuration</h2>
          <p className="text-muted-foreground mt-2">
            Configure your LiveKit server connection details to start monitoring your rooms and participants.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Server URL Field */}
          <div className="space-y-2">
            <label htmlFor="serverUrl" className="text-sm font-medium leading-none">
              Server URL *
            </label>
            <input
              id="serverUrl"
              type="url"
              placeholder="https://your-livekit-server.com"
              value={config.serverUrl}
              onChange={handleInputChange('serverUrl')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
            <p className="text-xs text-muted-foreground">
              The URL of your LiveKit server (e.g., wss://your-project.livekit.cloud or ws://localhost:7880)
            </p>
          </div>

          {/* API Key Field */}
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium leading-none">
              API Key *
            </label>
            <input
              id="apiKey"
              type="password"
              placeholder="your-api-key"
              value={config.apiKey}
              onChange={handleInputChange('apiKey')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
            <p className="text-xs text-muted-foreground">
              Your LiveKit API key for server authentication
            </p>
          </div>

          {/* API Secret Field */}
          <div className="space-y-2">
            <label htmlFor="apiSecret" className="text-sm font-medium leading-none">
              API Secret *
            </label>
            <input
              id="apiSecret"
              type="password"
              placeholder="your-api-secret"
              value={config.apiSecret}
              onChange={handleInputChange('apiSecret')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
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
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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