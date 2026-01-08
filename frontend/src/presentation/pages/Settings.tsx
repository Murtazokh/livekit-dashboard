import React from 'react';
import { ServerConfigForm } from '../components/settings/ServerConfigForm';
import { useSettings } from '../hooks/useSettings';

/**
 * Settings page for configuring LiveKit server connection
 * Provides a user interface for managing server credentials and testing connectivity
 */
export const Settings: React.FC = () => {
  const {
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
  } = useSettings();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24">
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
          <span className="text-lg">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure your LiveKit server to start monitoring your real-time communication infrastructure.
          </p>
        </div>

        <ServerConfigForm
          config={config}
          onConfigChange={updateConfig}
          onSubmit={saveConfig}
          onTestConnection={testConnection}
          isSaving={isSaving}
          isValidating={isValidating}
          error={error}
          success={success}
        />

        {/* Configuration Status */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">Configuration Status</h3>
            <div className="flex items-center space-x-2 text-sm">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConfigComplete() ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              />
              <span className={isConfigComplete() ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400'}>
                {isConfigComplete() ? 'Configuration complete' : 'Configuration incomplete'}
              </span>
            </div>
            {isConfigComplete() && (
              <p className="text-xs text-muted-foreground mt-1">
                You can now view your dashboard and monitor your LiveKit rooms.
              </p>
            )}
          </div>
        </div>

        {/* Clear Configuration */}
        {isConfigComplete() && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-destructive mb-2">Danger Zone</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Clear all saved configuration. This action cannot be undone.
              </p>
              <button
                onClick={clearConfig}
                className="inline-flex items-center justify-center rounded-md border border-destructive bg-background px-4 py-2 text-sm font-medium text-destructive shadow-sm hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Clear Configuration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};