/**
 * Interface for real-time data provider
 * Defines the contract for receiving real-time updates from LiveKit
 */
export interface IRealtimeProvider {
  /**
   * Connect to real-time updates
   * @returns Promise that resolves when connected
   */
  connect(): Promise<void>;

  /**
   * Disconnect from real-time updates
   * @returns Promise that resolves when disconnected
   */
  disconnect(): Promise<void>;

  /**
   * Subscribe to room updates
   * @param callback - Function called when rooms data changes
   * @returns Unsubscribe function
   */
  subscribeToRooms(callback: (rooms: any[]) => void): () => void;

  /**
   * Subscribe to participant updates for a specific room
   * @param roomName - Name of the room to monitor
   * @param callback - Function called when participants data changes
   * @returns Unsubscribe function
   */
  subscribeToParticipants(roomName: string, callback: (participants: any[]) => void): () => void;

  /**
   * Subscribe to agent updates for a specific room
   * @param roomName - Name of the room to monitor
   * @param callback - Function called when agents data changes
   * @returns Unsubscribe function
   */
  subscribeToAgents(roomName: string, callback: (agents: any[]) => void): () => void;

  /**
   * Get current connection status
   * @returns Connection status
   */
  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' | 'error';
}