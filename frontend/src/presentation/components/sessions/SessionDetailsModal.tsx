import React, { useState, useEffect } from 'react';
import type { Room } from '@/core/domain/Room';
import { useApiClient } from '../../providers/ApiClientProvider';
import { useRoomConnection } from '../../hooks/useRoomConnection';
import { TranscriptionPanel } from '../transcription';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface SessionDetailsModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SessionDetailsModal displays detailed information about a room session
 * including real-time transcriptions
 */
export const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  room,
  isOpen,
  onClose,
}) => {
  const { apiClient, isInitialized } = useApiClient();
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const [tokenError, setTokenError] = useState<Error | null>(null);

  // Generate participant identity once and keep it stable
  const [participantIdentity] = useState(() => `dashboard-viewer-${Date.now()}`);

  // Fetch access token when modal opens
  useEffect(() => {
    if (!isOpen || !isInitialized || !apiClient) {
      return;
    }

    const fetchToken = async () => {
      setIsLoadingToken(true);
      setTokenError(null);

      try {
        const { token: accessToken, serverUrl: url } = await apiClient.generateRoomToken(
          room.name,
          participantIdentity,
          'Dashboard Viewer'
        );
        setToken(accessToken);
        setServerUrl(url);
      } catch (error) {
        console.error('Failed to generate room token:', error);
        setTokenError(error instanceof Error ? error : new Error('Failed to generate token'));
      } finally {
        setIsLoadingToken(false);
      }
    };

    fetchToken();
  }, [isOpen, isInitialized, apiClient, room.name, participantIdentity]);

  // Connect to room when token is available
  const {
    isConnected,
    isConnecting,
    error: connectionError,
    transcriptions,
    disconnect,
  } = useRoomConnection({
    roomName: room.name,
    serverUrl: serverUrl || '',
    token: token || '',
  });

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      disconnect();
      setToken(null);
      setServerUrl(null);
      setTokenError(null);
    }
  }, [isOpen, disconnect]);

  if (!isOpen) {
    return null;
  }

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-card border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{room.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Session ID: <span className="font-mono">{room.sid}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Room Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Started At</h3>
              <p className="text-lg font-semibold">{formatTimestamp(room.creationTime)}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Participants</h3>
              <p className="text-lg font-semibold">{room.numParticipants}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Publishers</h3>
              <p className="text-lg font-semibold">{room.numPublishers || 0}</p>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingToken && (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-muted-foreground mt-4">Connecting to room...</p>
            </div>
          )}

          {/* Token Error */}
          {tokenError && !isLoadingToken && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-destructive">Failed to Connect</h4>
                  <p className="text-xs text-destructive/80 mt-1">{tokenError.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Transcription Panel */}
          {!isLoadingToken && !tokenError && token && serverUrl && (
            <TranscriptionPanel
              transcriptions={transcriptions}
              isConnected={isConnected}
              error={connectionError}
              className="h-[500px]"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-border bg-muted/30">
          {isConnecting && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoadingSpinner size="sm" />
              <span>Connecting...</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted-hover focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
