import React, { useState, useMemo } from 'react';
import { LayoutGrid, Users, Video, X, Clock, Circle, Settings as SettingsIcon } from 'lucide-react';
import { RoomList } from '../components/rooms/RoomList';
import { useSettings } from '../hooks/useSettings';
import { useRooms } from '../hooks/useRooms';
import { PageContainer } from '../components/layout/PageContainer';
import { MetricCard, MiniChart } from '../components/metrics';
import type { Room } from '@/core/domain/Room';

interface DashboardProps {}

/**
 * Main dashboard page showing rooms overview and metrics
 * Updated with Lucide icons and professional SaaS layout
 */
export const Dashboard: React.FC<DashboardProps> = () => {
  const { isConfigComplete } = useSettings();
  const { data: rooms } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);


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
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 10) + 1);
  }, []);

  const participantsTrendData = useMemo(() => {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 20) + 5);
  }, []);

  const publishersTrendData = useMemo(() => {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 8) + 1);
  }, []);

  if (!isConfigComplete()) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <div className="bg-card rounded-lg border shadow-sm p-8 max-w-2xl mx-auto fade-in">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full border border-primary/20">
                <SettingsIcon className="h-12 w-12 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Configuration Required</h2>
            <p className="text-muted-foreground mb-6">
              Please configure your LiveKit server settings before accessing the dashboard.
            </p>
            <a
              href="/settings"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary-hover transition-colors"
            >
              <SettingsIcon className="h-4 w-4" strokeWidth={2} />
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
        {/* Page Header */}
        <div className="fade-in stagger-1">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold tracking-tight">MISSION CONTROL</h1>
            <p className="text-muted-foreground text-base">
              Real-time infrastructure monitoring • LiveKit Dashboard
            </p>
          </div>
        </div>

        {/* Metrics Overview - Staggered reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="fade-in stagger-2">
            <MetricCard
              title="ACTIVE ROOMS"
              value={totalRooms}
              icon={<LayoutGrid className="h-5 w-5" strokeWidth={2.5} />}
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
              icon={<Users className="h-5 w-5" strokeWidth={2.5} />}
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
              icon={<Video className="h-5 w-5" strokeWidth={2.5} />}
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
                  <X className="w-5 h-5" strokeWidth={2.5} />
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
                      <Users className="h-3.5 w-3.5 text-success" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-3xl font-mono font-bold text-success counter-up">{selectedRoom.numParticipants}</p>
                </div>

                {/* Publishers */}
                <div className="space-y-3 p-4 rounded-lg bg-secondary/5 border border-secondary/20 hover:border-secondary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono font-semibold">PUBLISHERS</p>
                    <div className="p-1.5 bg-secondary/20 rounded">
                      <Video className="h-3.5 w-3.5 text-secondary" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-3xl font-mono font-bold text-secondary counter-up">{selectedRoom.numPublishers || 0}</p>
                </div>

                {/* Created Time */}
                <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono font-semibold">CREATED</p>
                    <div className="p-1.5 bg-primary/20 rounded">
                      <Clock className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-base font-mono font-semibold text-primary">{new Date(selectedRoom.creationTime * 1000).toLocaleTimeString()}</p>
                </div>

                {/* Recording Status */}
                <div className={`space-y-3 p-4 rounded-lg ${selectedRoom.activeRecording ? 'bg-destructive/5 border-destructive/30' : 'bg-muted/5 border-muted/30'} border hover:border-opacity-60 transition-colors`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono font-semibold">RECORDING</p>
                    <div className={`p-1.5 rounded ${selectedRoom.activeRecording ? 'bg-destructive/20 pulse-glow' : 'bg-muted/20'}`}>
                      <Circle
                        className={`h-3.5 w-3.5 ${selectedRoom.activeRecording ? 'text-destructive' : 'text-muted-foreground'}`}
                        fill="currentColor"
                        strokeWidth={2}
                      />
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
