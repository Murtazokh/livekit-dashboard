import React from 'react';

interface LiveIndicatorProps {
  lastUpdated?: Date;
  isRefreshing?: boolean;
  className?: string;
}

/**
 * Live indicator component with pulse animation
 * Shows real-time status and last updated time
 */
export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  lastUpdated,
  isRefreshing = false,
  className = '',
}) => {
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className={`flex items-center gap-3 text-sm ${className}`}>
      {/* Live indicator with pulse */}
      <div className="flex items-center gap-2">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </div>
        <span className="text-success font-medium">Live</span>
      </div>

      {/* Divider */}
      {lastUpdated && (
        <>
          <span className="text-border">•</span>

          {/* Last updated timestamp */}
          <div className="flex items-center gap-2 text-muted-foreground">
            {isRefreshing && (
              <svg
                className="animate-spin h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            <span>Updated {formatLastUpdated(lastUpdated)}</span>
          </div>
        </>
      )}
    </div>
  );
};
