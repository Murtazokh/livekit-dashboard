import React from 'react';
import { ServerConfigForm } from '../components/settings/ServerConfigForm';
import { useSettings } from '../hooks/useSettings';
import { PageContainer } from '../components/layout/PageContainer';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { StatusBadge } from '../components/ui';

/**
 * Settings page for configuring LiveKit server connection
 * Matches LiveKit Cloud Dashboard aesthetic with card-based sections
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
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" />
          <span className="mt-4 text-sm text-muted-foreground">Loading settings...</span>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your LiveKit server connection and monitoring preferences
          </p>
        </div>

        {/* Server Configuration Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Server Configuration</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Connect to your LiveKit server to start monitoring sessions
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
        </div>

        {/* Configuration Status Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Connection Status</h3>
          <div className="flex items-center gap-3">
            <StatusBadge
              status={isConfigComplete() ? 'success' : 'warning'}
              size="md"
            >
              {isConfigComplete() ? 'Connected' : 'Not Configured'}
            </StatusBadge>
            {isConfigComplete() && (
              <span className="text-sm text-muted-foreground">
                Dashboard is ready to monitor your LiveKit sessions
              </span>
            )}
          </div>
        </div>

        {/* Danger Zone Card */}
        {isConfigComplete() && (
          <div className="bg-card border border-destructive/20 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-destructive mb-1">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Clear all saved configuration. You will need to reconfigure your server connection.
                </p>
                <button
                  onClick={clearConfig}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-medium border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  Clear Configuration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
