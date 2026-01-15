/**
 * Real-Time Events Hook
 * Manages Server-Sent Events (SSE) connection for real-time updates
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SSEMessage, ConnectionState } from '../../types/sse';
import { roomsQueryKeys } from './useRooms';

interface UseRealtimeEventsReturn {
  isConnected: boolean;
  connectionState: ConnectionState;
  lastEvent: Date | null;
  reconnectAttempts: number;
  manualReconnect: () => void;
}

// Configuration
const SSE_ENDPOINT = '/api/events';
const MAX_RECONNECT_ATTEMPTS = 10;
const INITIAL_RECONNECT_DELAY = 1000; // 1 second
const MAX_RECONNECT_DELAY = 30000; // 30 seconds
const HEARTBEAT_TIMEOUT = 60000; // 60 seconds without heartbeat = disconnect

export function useRealtimeEvents(): UseRealtimeEventsReturn {
  const queryClient = useQueryClient();

  // State
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting');
  const [lastEvent, setLastEvent] = useState<Date | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Refs
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const receivedMessageIds = useRef<Set<string>>(new Set());
  const lastHeartbeat = useRef<number>(Date.now());
  const reconnectDelay = useRef<number>(INITIAL_RECONNECT_DELAY);

  /**
   * Reset heartbeat timer
   */
  const resetHeartbeatTimer = useCallback(() => {
    lastHeartbeat.current = Date.now();

    // Clear existing timeout
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }

    // Set new timeout
    heartbeatTimeoutRef.current = setTimeout(() => {
      const timeSinceLastHeartbeat = Date.now() - lastHeartbeat.current;
      if (timeSinceLastHeartbeat > HEARTBEAT_TIMEOUT) {
        console.warn('No heartbeat received for 60s, reconnecting...');
        setConnectionState('disconnected');
        reconnect();
      }
    }, HEARTBEAT_TIMEOUT);
  }, []);

  /**
   * Handle incoming SSE message
   */
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        // Reset heartbeat timer on any message
        resetHeartbeatTimer();

        const message: SSEMessage = JSON.parse(event.data);

        // Deduplicate messages by ID
        if (receivedMessageIds.current.has(message.id)) {
          console.debug('Duplicate message ignored:', message.id);
          return;
        }

        // Add to received set (keep last 1000 IDs)
        receivedMessageIds.current.add(message.id);
        if (receivedMessageIds.current.size > 1000) {
          const firstId = receivedMessageIds.current.values().next().value;
          receivedMessageIds.current.delete(firstId);
        }

        // Update last event timestamp
        setLastEvent(new Date(message.timestamp));

        console.log('SSE message received:', message.event, message.type);

        // Handle system events
        if (message.type === 'system') {
          handleSystemEvent(message);
          return;
        }

        // Handle LiveKit events
        if (message.type === 'livekit') {
          handleLiveKitEvent(message);
        }
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    },
    [resetHeartbeatTimer]
  );

  /**
   * Handle system events
   */
  const handleSystemEvent = useCallback((message: SSEMessage) => {
    switch (message.event) {
      case 'connected':
        console.log('SSE connected to server:', message.data.connectionId);
        setConnectionState('connected');
        setReconnectAttempts(0);
        reconnectDelay.current = INITIAL_RECONNECT_DELAY;
        break;

      case 'error':
        console.error('SSE error event:', message.data.error);
        break;

      case 'disconnected':
        console.log('SSE disconnected by server');
        setConnectionState('disconnected');
        break;
    }
  }, []);

  /**
   * Handle LiveKit webhook events
   */
  const handleLiveKitEvent = useCallback(
    (message: SSEMessage) => {
      console.log('LiveKit event:', message.event, {
        room: message.data.room?.name,
        participant: message.data.participant?.identity,
      });

      // Invalidate React Query cache based on event type
      switch (message.event) {
        case 'room_started':
        case 'room_finished':
          // Invalidate all rooms query
          queryClient.invalidateQueries({
            queryKey: roomsQueryKeys.all,
          });
          break;

        case 'participant_joined':
        case 'participant_left':
          if (message.data.room?.name) {
            // Invalidate specific room query
            queryClient.invalidateQueries({
              queryKey: ['rooms', message.data.room.name],
            });
            // Invalidate participants query for this room
            queryClient.invalidateQueries({
              queryKey: ['participants', message.data.room.name],
            });
          }
          // Also invalidate rooms list (participant count changed)
          queryClient.invalidateQueries({
            queryKey: roomsQueryKeys.all,
          });
          break;

        case 'track_published':
        case 'track_unpublished':
          if (message.data.room?.name) {
            // Invalidate participants query (track state changed)
            queryClient.invalidateQueries({
              queryKey: ['participants', message.data.room.name],
            });
            // Invalidate room query (publisher count may have changed)
            queryClient.invalidateQueries({
              queryKey: ['rooms', message.data.room.name],
            });
          }
          break;

        default:
          console.debug('Unhandled LiveKit event:', message.event);
      }
    },
    [queryClient]
  );

  /**
   * Connect to SSE endpoint
   */
  const connect = useCallback(() => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    console.log('Connecting to SSE endpoint:', SSE_ENDPOINT);
    setConnectionState('connecting');

    try {
      const eventSource = new EventSource(SSE_ENDPOINT);
      eventSourceRef.current = eventSource;

      // Connection opened
      eventSource.onopen = () => {
        console.log('SSE connection opened');
        resetHeartbeatTimer();
      };

      // Message received
      eventSource.onmessage = handleMessage;

      // Error occurred
      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        setConnectionState('disconnected');

        // EventSource will automatically try to reconnect
        // but we want to handle reconnection ourselves
        eventSource.close();
        eventSourceRef.current = null;

        // Attempt reconnection
        reconnect();
      };
    } catch (error) {
      console.error('Failed to create EventSource:', error);
      setConnectionState('error');
      reconnect();
    }
  }, [handleMessage, resetHeartbeatTimer]);

  /**
   * Reconnect with exponential backoff
   */
  const reconnect = useCallback(() => {
    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Check if we've reached max attempts
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached');
      setConnectionState('error');
      return;
    }

    const delay = reconnectDelay.current;
    console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})...`);

    setReconnectAttempts((prev) => prev + 1);

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, delay);

    // Exponential backoff
    reconnectDelay.current = Math.min(reconnectDelay.current * 2, MAX_RECONNECT_DELAY);
  }, [reconnectAttempts, connect]);

  /**
   * Manual reconnect (user-triggered)
   */
  const manualReconnect = useCallback(() => {
    console.log('Manual reconnect triggered');
    setReconnectAttempts(0);
    reconnectDelay.current = INITIAL_RECONNECT_DELAY;
    connect();
  }, [connect]);

  /**
   * Initialize connection on mount
   */
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up SSE connection');

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
        heartbeatTimeoutRef.current = null;
      }
    };
  }, [connect]);

  return {
    isConnected: connectionState === 'connected',
    connectionState,
    lastEvent,
    reconnectAttempts,
    manualReconnect,
  };
}
