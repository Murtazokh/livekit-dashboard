import React, { useState, useEffect, useMemo } from 'react';
import { RoomList } from '../components/rooms/RoomList';
import { useSettings } from '../hooks/useSettings';
import { useRooms } from '../hooks/useRooms';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LiveIndicator } from '../components/ui/LiveIndicator';
import { PageContainer } from '../components/layout/PageContainer';
import { MetricCard, MiniChart } from '../components/metrics';
import type { Room } from '@/core/domain/Room';

interface DashboardProps {}

/**
 * Main dashboard page showing rooms overview and metrics
 */
export const Dashboard: React.FC<DashboardProps> = () => {
  const { isConfigComplete } = useSettings();
  const { data: rooms, isFetching, isLoading, dataUpdatedAt } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Update last updated time when data changes
  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdated(new Date(dataUpdatedAt));
    }
  }, [dataUpdatedAt]);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    console.log('Selected room:', room);
  };

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

  if (!isConfigComplete()) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <div className="bg-card rounded-lg border shadow-sm p-8 max-w-2xl mx-auto">
            <svg className="h-12 w-12 mx-auto text-muted-foreground mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m16.24-3.76l-4.24 4.24m-6-6L2.76 6.24m16.24 12.52l-4.24-4.24m-6 6L2.76 17.76"/>
            </svg>
            <h2 className="text-2xl font-semibold mb-2">Configuration Required</h2>
            <p className="text-muted-foreground mb-6">
              Please configure your LiveKit server settings before accessing the dashboard.
            </p>
            <a
              href="/settings"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary-hover transition-colors"
            >
              Go to Settings
            </a>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Page Header - Technical Excellence */}
        <div className="fade-in stagger-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-border relative">
            {/* Corner brackets for technical feel */}
            <div className="corner-brackets">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-extrabold tracking-tight">MISSION CONTROL</h1>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-mono font-semibold rounded border border-primary/30 bg-primary/10 text-primary">
                    LIVE
                  </span>
                </div>
                <p className="text-muted-foreground text-base">
                  Real-time infrastructure monitoring • LiveKit Dashboard
                </p>
              </div>
            </div>
            <LiveIndicator lastUpdated={lastUpdated} isRefreshing={isFetching && !isLoading} />
          </div>
        </div>

        {/* Metrics Overview - Staggered reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="fade-in stagger-2">
            <MetricCard
              title="ACTIVE ROOMS"
              value={totalRooms}
              icon={
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <path d="M3 9h18M9 21V9"/>
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
              className="scanline"
            />
          </div>

          <div className="fade-in stagger-3">
            <MetricCard
              title="PARTICIPANTS"
              value={totalParticipants}
              icon={
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
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
          </div>

          <div className="fade-in stagger-4">
            <MetricCard
              title="PUBLISHERS"
              value={totalPublishers}
              icon={
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              }
              iconColor="text-secondary"
              trend={{ value: 5, isPositive: false }}
              chart={
                <MiniChart
                  data={publishersTrendData}
                  color="hsl(var(--secondary))"
                  width={120}
                  height={32}
                />
              }
            />
          </div>
        </div>

        {/* Rooms Section - Technical layout */}
        <div className="space-y-4 fade-in stagger-5">
          <div className="flex items-center justify-between border-l-2 border-primary pl-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">ACTIVE SESSIONS</h2>
              <p className="text-sm text-muted-foreground mt-2 font-mono">
                {totalRooms === 0
                  ? '// NO ACTIVE SESSIONS'
                  : `// ${totalRooms} ${totalRooms === 1 ? 'SESSION' : 'SESSIONS'} • REAL-TIME MONITORING`
                }
              </p>
            </div>
            {totalRooms > 0 && (
              <div className="px-4 py-2 rounded-md bg-primary/10 border border-primary/30">
                <span className="text-2xl font-mono font-bold text-primary">{totalRooms}</span>
              </div>
            )}
          </div>

          <RoomList onRoomClick={handleRoomClick} />
        </div>

        {/* Selected Room Details - Technical Panel */}
        {selectedRoom && (
          <div className="bg-card text-card-foreground rounded-lg border border-primary/30 shadow-lg overflow-hidden slide-up relative">
            {/* Animated border glow */}
            <div className="absolute inset-0 border border-primary/50 pointer-events-none"></div>

            {/* Header with technical styling */}
            <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent px-6 py-4 border-b border-primary/30 relative">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold tracking-tight">SESSION DIAGNOSTICS</h3>
                    <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded border border-primary/40 bg-primary/20 text-primary pulse-glow">
                      MONITORING
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">ID:</span>
                    <p className="text-sm font-mono font-semibold text-primary">{selectedRoom.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all"
                  aria-label="Close session diagnostics"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="p-6 bg-gradient-to-br from-card to-card-hover">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Participants */}
                <div className="space-y-3 p-4 rounded-lg bg-success/5 border border-success/20 hover:border-success/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono font-semibold">PARTICIPANTS</p>
                    <div className="p-1.5 bg-success/20 rounded">
                      <svg className="h-3.5 w-3.5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-mono font-bold text-success counter-up">{selectedRoom.numParticipants}</p>
                </div>

                {/* Publishers */}
                <div className="space-y-3 p-4 rounded-lg bg-secondary/5 border border-secondary/20 hover:border-secondary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono font-semibold">PUBLISHERS</p>
                    <div className="p-1.5 bg-secondary/20 rounded">
                      <svg className="h-3.5 w-3.5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="23 7 16 12 23 17 23 7"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-3xl font-mono font-bold text-secondary counter-up">{selectedRoom.numPublishers || 0}</p>
                </div>

                {/* Created Time */}
                <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono font-semibold">CREATED</p>
                    <div className="p-1.5 bg-primary/20 rounded">
                      <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-base font-mono font-semibold text-primary">{new Date(selectedRoom.creationTime * 1000).toLocaleTimeString()}</p>
                </div>

                {/* Recording Status */}
                <div className={`space-y-3 p-4 rounded-lg ${selectedRoom.activeRecording ? 'bg-destructive/5 border-destructive/30' : 'bg-muted/5 border-muted/30'} border hover:border-opacity-60 transition-colors`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono font-semibold">RECORDING</p>
                    <div className={`p-1.5 rounded ${selectedRoom.activeRecording ? 'bg-destructive/20 pulse-glow' : 'bg-muted/20'}`}>
                      <svg className={`h-3.5 w-3.5 ${selectedRoom.activeRecording ? 'text-destructive' : 'text-muted-foreground'}`} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" fill="none"/>
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    </div>
                  </div>
                  <p className={`text-lg font-mono font-bold uppercase ${selectedRoom.activeRecording ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {selectedRoom.activeRecording ? 'LIVE' : 'INACTIVE'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};