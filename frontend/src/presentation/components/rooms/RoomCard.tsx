import React from 'react';
import type { Room } from '@/core/domain/Room';

interface RoomCardProps {
  room: Room;
  onClick?: (room: Room) => void;
}

/**
 * Card component displaying room information
 * Shows room name, participant count, and creation time
 */
export const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getParticipantColor = (count: number) => {
    if (count === 0) return 'text-muted-foreground';
    if (count < 5) return 'text-green-600 dark:text-green-400';
    if (count < 10) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div
      className={`bg-card text-card-foreground rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer ${
        onClick ? 'hover:border-ring' : ''
      }`}
      onClick={() => onClick?.(room)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate" title={room.name}>
            {room.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Created {formatTime(room.creationTime)}
          </p>
        </div>

        <div className="ml-4 flex-shrink-0">
          <div className="flex items-center space-x-1">
            <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 2l-4 4"/>
              <circle cx="18" cy="6" r="1"/>
            </svg>
            <span className={`text-sm font-medium ${getParticipantColor(room.numParticipants)}`}>
              {room.numParticipants}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          {room.numPublishers !== undefined && (
            <div className="flex items-center space-x-1">
              <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              <span className="text-muted-foreground">
                {room.numPublishers} publishers
              </span>
            </div>
          )}

          {room.maxParticipants && (
            <div className="flex items-center space-x-1">
              <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
              </svg>
              <span className="text-muted-foreground">
                Max {room.maxParticipants}
              </span>
            </div>
          )}
        </div>

        {room.activeRecording && (
          <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">Recording</span>
          </div>
        )}
      </div>
    </div>
  );
};