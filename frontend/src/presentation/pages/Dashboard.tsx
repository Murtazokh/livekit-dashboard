import React, { useState } from 'react';
import { RoomList } from '../components/rooms/RoomList';
import { useSettings } from '../hooks/useSettings';
import type { Room } from '@/core/domain/Room';

interface DashboardProps {}

/**
 * Main dashboard page showing rooms overview and metrics
 */
export const Dashboard: React.FC<DashboardProps> = () => {
  const { isConfigComplete } = useSettings();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    // TODO: Navigate to room details page or show modal
    console.log('Selected room:', room);
  };

  if (!isConfigComplete()) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Dashboard</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Configure your LiveKit server to start monitoring
            </p>
            <div className="bg-card rounded-lg border shadow-sm p-8 max-w-2xl mx-auto">
              <div className="text-center">
                <svg className="h-16 w-16 mx-auto text-muted-foreground mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m16.24-3.76l-4.24 4.24m-6-6L2.76 6.24m16.24 12.52l-4.24-4.24m-6 6L2.76 17.76"/>
                </svg>
                <h2 className="text-2xl font-semibold mb-2">Configuration Required</h2>
                <p className="text-muted-foreground mb-6">
                  Please configure your LiveKit server settings before accessing the dashboard.
                </p>
                <a
                  href="/settings"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Go to Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your LiveKit rooms and real-time communication infrastructure
          </p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="15"></line>
                <line x1="15" y1="9" x2="9" y2="15"></line>
              </svg>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
                <p className="text-2xl font-bold">--</p>
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Participants</p>
                <p className="text-2xl font-bold">--</p>
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Streams</p>
                <p className="text-2xl font-bold">--</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Active Rooms</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
          </div>

          <RoomList onRoomClick={handleRoomClick} />
        </div>

        {/* Selected Room Details (for future expansion) */}
        {selectedRoom && (
          <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Room Details: {selectedRoom.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Participants</p>
                <p className="font-medium">{selectedRoom.numParticipants}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Publishers</p>
                <p className="font-medium">{selectedRoom.numPublishers || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{new Date(selectedRoom.creationTime * 1000).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Recording</p>
                <p className="font-medium">{selectedRoom.activeRecording ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};