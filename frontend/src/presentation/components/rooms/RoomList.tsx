import React from 'react';
import { RoomCard } from './RoomCard';
import { useRooms } from '../../hooks/useRooms';
import type { Room } from '@/core/domain/Room';

interface RoomListProps {
  onRoomClick?: (room: Room) => void;
  filters?: any;
}

/**
 * Component that displays a list of rooms
 * Handles loading, error, and empty states
 */
export const RoomList: React.FC<RoomListProps> = ({ onRoomClick, filters }) => {
  const { data: rooms, isLoading, error, refetch } = useRooms(filters);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border shadow-sm p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
              <div className="h-6 w-12 bg-muted rounded"></div>
            </div>
            <div className="mt-4 flex space-x-4">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <svg className="h-12 w-12 text-destructive mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load rooms</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 rounded-lg p-8 max-w-md mx-auto">
          <svg className="h-16 w-16 text-muted-foreground mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="15"></line>
            <line x1="15" y1="9" x2="9" y2="15"></line>
          </svg>
          <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
          <p className="text-muted-foreground">
            There are currently no active rooms on your LiveKit server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rooms.map((room) => (
        <RoomCard
          key={room.sid}
          room={room}
          onClick={onRoomClick}
        />
      ))}
    </div>
  );
};