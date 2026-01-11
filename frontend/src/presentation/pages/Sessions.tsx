import React, { useState, useEffect, useMemo } from 'react';
import { useRooms } from '../hooks/useRooms';
import { DataTable, TableSkeleton } from '../components/table';
import type { Column } from '../components/table';
import { StatusBadge, FeatureBadge } from '../components/ui';
import { LiveIndicator } from '../components/ui/LiveIndicator';
import { PageContainer } from '../components/layout/PageContainer';
import { FilterBar } from '../components/filters';
import { MetricCard, MiniChart } from '../components/metrics';
import { SessionDetailsModal } from '../components/sessions';
import type { TimeRange } from '../components/filters';
import type { Room } from '@/core/domain/Room';

/**
 * Sessions page with data table matching LiveKit Cloud Dashboard
 */
export const Sessions: React.FC = () => {
  const { data: rooms, isLoading, error, refetch, isFetching, dataUpdatedAt } = useRooms();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [searchValue, setSearchValue] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRange>('last_24_hours');
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Update last updated time when data changes
  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdated(new Date(dataUpdatedAt));
    }
  }, [dataUpdatedAt]);

  // Calculate metrics from rooms data
  const totalRooms = rooms?.length || 0;
  const totalParticipants = rooms?.reduce((sum, room) => sum + room.numParticipants, 0) || 0;
  const totalPublishers = rooms?.reduce((sum, room) => sum + (room.numPublishers || 0), 0) || 0;

  // Generate mock trend data for demonstration
  // TODO: Replace with real historical data from API
  const roomsTrendData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => Math.floor(Math.random() * 10) + 1);
  }, []);

  const participantsTrendData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => Math.floor(Math.random() * 20) + 5);
  }, []);

  const publishersTrendData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => Math.floor(Math.random() * 8) + 1);
  }, []);

  // Filter rooms based on search value
  const filteredRooms = useMemo(() => {
    if (!rooms) return [];

    return rooms.filter((room) => {
      // Search filter
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        const matchesSearch =
          room.name.toLowerCase().includes(searchLower) ||
          room.sid.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Time range filter (TODO: implement when we have creation time filtering)
      // Currently showing all rooms as we don't have historical data

      return true;
    });
  }, [rooms, searchValue, timeRange]);

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
            <FeatureBadge type="recording" />
          )}
          {room.numPublishers && room.numPublishers > 0 && (
            <FeatureBadge type="sip" count={room.numPublishers} />
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
    setSelectedRoom(room);
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
    <>
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

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricCard
          title="Total Rooms"
          value={totalRooms}
          icon={
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="15"></line>
              <line x1="15" y1="9" x2="9" y2="15"></line>
            </svg>
          }
          iconColor="text-primary"
          trend={{ value: 12, isPositive: true }}
          chart={
            <MiniChart
              data={roomsTrendData}
              color="hsl(var(--primary))"
              width={120}
              height={32}
            />
          }
        />

        <MetricCard
          title="Active Participants"
          value={totalParticipants}
          icon={
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
          }
          iconColor="text-success"
          trend={{ value: 8, isPositive: true }}
          chart={
            <MiniChart
              data={participantsTrendData}
              color="hsl(var(--success))"
              width={120}
              height={32}
            />
          }
        />

        <MetricCard
          title="Active Publishers"
          value={totalPublishers}
          icon={
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          }
          iconColor="text-info"
          trend={{ value: 5, isPositive: false }}
          chart={
            <MiniChart
              data={publishersTrendData}
              color="hsl(var(--info))"
              width={120}
              height={32}
            />
          }
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        isAutoRefreshEnabled={isAutoRefreshEnabled}
        onAutoRefreshToggle={() => setIsAutoRefreshEnabled(!isAutoRefreshEnabled)}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        className="mb-6"
      />

      {isLoading ? (
        <TableSkeleton
          columns={columns.map((col) => ({ label: col.label, align: col.align }))}
          rows={5}
        />
      ) : (
        <DataTable
          data={filteredRooms}
          columns={columns}
          keyExtractor={(room) => room.sid}
          onRowClick={handleRowClick}
          emptyMessage={
            searchValue
              ? `No sessions found matching "${searchValue}"`
              : "No active sessions. Start a room to see it appear here."
          }
        />
      )}
      </PageContainer>

      {/* Session Details Modal */}
      {selectedRoom && (
        <SessionDetailsModal
          room={selectedRoom}
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </>
  );
};
