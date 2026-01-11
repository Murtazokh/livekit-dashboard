import React, { useEffect, useRef } from 'react';
import type { TranscriptionDisplay } from '../../hooks/useRoomConnection';

interface TranscriptionPanelProps {
  transcriptions: TranscriptionDisplay[];
  isConnected: boolean;
  error?: Error | null;
  className?: string;
}

/**
 * TranscriptionPanel displays real-time transcriptions from a LiveKit room
 * Shows participant names, timestamps, and transcript text
 * Distinguishes between interim (gray) and final (white) transcriptions
 */
export const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcriptions,
  isConnected,
  error,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new transcriptions arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptions]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className={`flex flex-col h-full bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
          <h3 className="text-lg font-semibold">Live Transcription</h3>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-2 text-success text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span>Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="inline-flex rounded-full h-2 w-2 bg-muted-foreground"></span>
              <span>Disconnected</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-destructive">Connection Error</h4>
                <p className="text-xs text-destructive/80 mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {transcriptions.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="w-12 h-12 text-muted-foreground/50 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              {isConnected ? 'Waiting for transcriptions...' : 'Not connected to room'}
            </h4>
            <p className="text-xs text-muted-foreground/70">
              {isConnected
                ? 'Transcriptions will appear here when participants speak'
                : 'Connect to a room to see live transcriptions'}
            </p>
          </div>
        )}

        {transcriptions.map((segment) => (
          <div
            key={segment.id}
            className={`flex flex-col gap-1 p-3 rounded-lg transition-all ${
              segment.isFinal
                ? 'bg-card-foreground/5 border border-border'
                : 'bg-muted/30 border border-muted/50'
            }`}
          >
            {/* Header: Participant + Time */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {segment.participantName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium">{segment.participantName}</span>
              </div>
              <div className="flex items-center gap-2">
                {!segment.isFinal && (
                  <span className="text-xs px-2 py-0.5 bg-warning/10 text-warning rounded">
                    interim
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatTime(segment.timestamp)}
                </span>
              </div>
            </div>

            {/* Transcription Text */}
            <p
              className={`text-sm leading-relaxed ${
                segment.isFinal ? 'text-foreground' : 'text-muted-foreground italic'
              }`}
            >
              {segment.text}
            </p>
          </div>
        ))}
      </div>

      {/* Footer with info */}
      {transcriptions.length > 0 && (
        <div className="p-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            {transcriptions.length} transcription{transcriptions.length !== 1 ? 's' : ''} received
          </p>
        </div>
      )}
    </div>
  );
};
