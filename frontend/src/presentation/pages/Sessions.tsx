import React, { useState, useEffect } from 'react';
import { useRooms } from '../hooks/useRooms';
import { DataTable, TableSkeleton } from '../components/table';
import type { Column } from '../components/table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LiveIndicator } from '../components/ui/LiveIndicator';
import { PageContainer } from '../components/layout/PageContainer';
import type { Room } from '@/core/domain/Room';

/**
 * Sessions page with data table matching LiveKit Cloud Dashboard
 */
export const Sessions: React.FC = () => {
  const { data: rooms, isLoading, error, refetch, isFetching, dataUpdatedAt } = useRooms();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Update last updated time when data changes
  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdated(new Date(dataUpdatedAt));
    }
  }, [dataUpdatedAt]);

  // Format duration from creation time to now
  const formatDuration = (creationTime: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const duration = now - creationTime;

    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.floor(duration / 60)}m`;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Define table columns
  const columns: Column<Room>[] = [
    {
      key: 'sid',
      label: 'Session ID',
      sortable: true,
      render: (room) => (
        <span className="font-mono text-xs text-muted-foreground">{room.sid}</span>
      ),
    },
    {
      key: 'name',
      label: 'Room name',
      sortable: true,
      render: (room) => <span className="font-medium">{room.name}</span>,
    },
    {
      key: 'creationTime',
      label: 'Started at',
      sortable: true,
      render: (room) => (
        <span className="text-muted-foreground">{formatTimestamp(room.creationTime)}</span>
      ),
    },
    {
      key: 'endedAt',
      label: 'Ended at',
      align: 'left',
      render: () => <span className="text-muted-foreground">—</span>,
    },
    {
      key: 'duration',
      label: 'Duration',
      sortable: true,
      render: (room) => (
        <span className="font-medium">{formatDuration(room.creationTime)}</span>
      ),
    },
    {
      key: 'numParticipants',
      label: 'Participants',
      sortable: true,
      align: 'center',
      render: (room) => <span className="font-medium">{room.numParticipants}</span>,
    },
    {
      key: 'features',
      label: 'Features',
      render: (room) => (
        <div className="flex items-center gap-2">
          {room.activeRecording && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" />
              </svg>
              Recording
            </span>
          )}
          {room.numPublishers && room.numPublishers > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              {room.numPublishers} SIP
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: () => (
        <StatusBadge status="active" size="sm">
          ACTIVE
        </StatusBadge>
      ),
    },
  ];

  const handleRowClick = (room: Room) => {
    console.log('Room clicked:', room);
    // TODO: Open room details modal or navigate to room details page
  };

  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4">
            <svg
              className="w-6 h-6 text-destructive"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Failed to load sessions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            Try Again
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header with Live Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Sessions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time view of all active and completed sessions
          </p>
        </div>
        <LiveIndicator lastUpdated={lastUpdated} isRefreshing={isFetching && !isLoading} />
      </div>

      {isLoading ? (
        <TableSkeleton
          columns={columns.map((col) => ({ label: col.label, align: col.align }))}
          rows={5}
        />
      ) : (
        <DataTable
          data={rooms || []}
          columns={columns}
          keyExtractor={(room) => room.sid}
          onRowClick={handleRowClick}
          emptyMessage="No active sessions. Start a room to see it appear here."
        />
      )}
    </PageContainer>
  );
};
