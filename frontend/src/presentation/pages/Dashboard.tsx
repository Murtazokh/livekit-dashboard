import React, { useState } from 'react';
import { RoomList } from '../components/rooms/RoomList';
import { useSettings } from '../hooks/useSettings';
import { useRooms } from '../hooks/useRooms';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PageContainer } from '../components/layout/PageContainer';
import type { Room } from '@/core/domain/Room';

interface DashboardProps {}

/**
 * Main dashboard page showing rooms overview and metrics
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
      <div className="space-y-6 animate-fade-in">


        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card text-card-foreground rounded-lg border p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Total Rooms</p>
                <p className="text-3xl font-bold">{totalRooms}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-lg border p-6 hover:border-success/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Active Participants</p>
                <p className="text-3xl font-bold text-success">{totalParticipants}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <svg className="h-5 w-5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-lg border p-6 hover:border-info/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Active Publishers</p>
                <p className="text-3xl font-bold text-info">{totalPublishers}</p>
              </div>
              <div className="p-3 bg-info/10 rounded-lg">
                <svg className="h-5 w-5 text-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Active Rooms</h2>
            <StatusBadge status="active" size="sm">
              Live
            </StatusBadge>
          </div>

          <RoomList onRoomClick={handleRoomClick} />
        </div>

        {/* Selected Room Details */}
        {selectedRoom && (
          <div className="mt-6 bg-card text-card-foreground rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Room Details: {selectedRoom.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Participants</p>
                <p className="text-lg font-medium">{selectedRoom.numParticipants}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Publishers</p>
                <p className="text-lg font-medium">{selectedRoom.numPublishers || 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Created</p>
                <p className="text-lg font-medium font-mono text-xs">{new Date(selectedRoom.creationTime * 1000).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Recording</p>
                <p className="text-lg font-medium">{selectedRoom.activeRecording ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};