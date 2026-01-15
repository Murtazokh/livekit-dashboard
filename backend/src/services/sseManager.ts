/**
 * SSE Manager Service
 * Manages Server-Sent Events connections and broadcasts
 */

import { Response } from 'express';
import { randomUUID } from 'crypto';
import { SSEMessage, SSEClientConnection, SSEManagerStats, SystemEventType } from '../types/sse';

export class SSEManager {
  private clients = new Map<string, SSEClientConnection>();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;

  // Configuration
  private readonly MAX_TOTAL_CONNECTIONS = 1000;
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly CLEANUP_INTERVAL = 60000; // 1 minute
  private readonly MAX_CONNECTION_AGE = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_IDLE_TIME = 5 * 60 * 1000; // 5 minutes without activity

  // Statistics
  private stats = {
    totalConnections: 0,
    messagesSent: 0,
    errorCount: 0,
    startTime: Date.now(),
  };

  constructor() {
    this.startHeartbeat();
    this.startCleanup();
  }

  /**
   * Add a new SSE client connection
   */
  addClient(connectionId: string, res: Response, ip?: string, userAgent?: string): boolean {
    // Check if we've reached the connection limit
    if (this.clients.size >= this.MAX_TOTAL_CONNECTIONS) {
      console.warn(`SSE connection limit reached: ${this.clients.size}/${this.MAX_TOTAL_CONNECTIONS}`);
      return false;
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // Enable CORS for SSE
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Create client connection object
    const client: SSEClientConnection = {
      id: connectionId,
      response: res,
      connectedAt: Date.now(),
      lastActivity: Date.now(),
      ip,
      userAgent,
    };

    // Add to active clients
    this.clients.set(connectionId, client);
    this.stats.totalConnections++;

    console.log(`SSE client connected: ${connectionId} (${this.clients.size} active)`);

    // Send initial "connected" event
    this.sendToClient(connectionId, this.createSystemMessage('connected', {
      connectionId,
      serverVersion: '1.0.0',
      supportedEvents: [
        'room_started',
        'room_finished',
        'participant_joined',
        'participant_left',
        'track_published',
        'track_unpublished',
      ],
    }));

    return true;
  }

  /**
   * Remove a client connection
   */
  removeClient(connectionId: string): void {
    const client = this.clients.get(connectionId);
    if (client) {
      try {
        // Try to send a disconnect message
        this.sendToClient(connectionId, this.createSystemMessage('disconnected', {
          reason: 'Server closed connection',
        }));

        // Close the response
        client.response.end();
      } catch (error) {
        // Connection already closed, ignore
      }

      this.clients.delete(connectionId);
      console.log(`SSE client disconnected: ${connectionId} (${this.clients.size} remaining)`);
    }
  }

  /**
   * Broadcast a message to all connected clients
   */
  broadcast(message: SSEMessage): void {
    let successCount = 0;
    let failureCount = 0;

    const data = this.formatSSEMessage(message);

    this.clients.forEach((client, id) => {
      try {
        client.response.write(data);
        client.lastActivity = Date.now();
        successCount++;
        this.stats.messagesSent++;
      } catch (error) {
        console.error(`Failed to send message to client ${id}:`, error);
        failureCount++;
        this.stats.errorCount++;
        // Remove dead connection
        this.removeClient(id);
      }
    });

    if (failureCount > 0) {
      console.warn(`Broadcast completed: ${successCount} succeeded, ${failureCount} failed`);
    }
  }

  /**
   * Send a message to a specific client
   */
  sendToClient(connectionId: string, message: SSEMessage): boolean {
    const client = this.clients.get(connectionId);
    if (!client) {
      console.warn(`Client not found: ${connectionId}`);
      return false;
    }

    try {
      const data = this.formatSSEMessage(message);
      client.response.write(data);
      client.lastActivity = Date.now();
      this.stats.messagesSent++;
      return true;
    } catch (error) {
      console.error(`Failed to send to client ${connectionId}:`, error);
      this.stats.errorCount++;
      this.removeClient(connectionId);
      return false;
    }
  }

  /**
   * Format message according to SSE protocol
   */
  private formatSSEMessage(message: SSEMessage): string {
    // SSE format: data: <json>\n\n
    return `data: ${JSON.stringify(message)}\n\n`;
  }

  /**
   * Create a system message
   */
  createSystemMessage(event: SystemEventType, data: any): SSEMessage {
    return {
      id: randomUUID(),
      type: 'system',
      event,
      timestamp: Date.now(),
      data,
      metadata: {
        source: 'internal',
        version: '1.0.0',
      },
    };
  }

  /**
   * Create a LiveKit event message
   */
  createLivekitMessage(event: string, data: any): SSEMessage {
    return {
      id: randomUUID(),
      type: 'livekit',
      event,
      timestamp: Date.now(),
      data,
      metadata: {
        source: 'webhook',
        version: '1.0.0',
      },
    };
  }

  /**
   * Start heartbeat mechanism
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      // Send heartbeat comment (won't trigger onmessage in clients)
      const heartbeat = ': heartbeat\n\n';

      this.clients.forEach((client, id) => {
        try {
          client.response.write(heartbeat);
          client.lastActivity = Date.now();
        } catch (error) {
          console.error(`Heartbeat failed for client ${id}:`, error);
          this.removeClient(id);
        }
      });
    }, this.HEARTBEAT_INTERVAL);

    console.log(`SSE heartbeat started (interval: ${this.HEARTBEAT_INTERVAL}ms)`);
  }

  /**
   * Start cleanup mechanism for stale connections
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const staleConnections: string[] = [];

      this.clients.forEach((client, id) => {
        const age = now - client.connectedAt;
        const idleTime = now - client.lastActivity;

        // Check if connection is too old
        if (age > this.MAX_CONNECTION_AGE) {
          console.log(`Closing stale connection (age): ${id} (${Math.round(age / 1000 / 60)} minutes)`);
          staleConnections.push(id);
        }
        // Check if connection has been idle too long
        else if (idleTime > this.MAX_IDLE_TIME) {
          console.log(`Closing idle connection: ${id} (${Math.round(idleTime / 1000 / 60)} minutes)`);
          staleConnections.push(id);
        }
      });

      // Remove stale connections
      staleConnections.forEach(id => this.removeClient(id));

      if (staleConnections.length > 0) {
        console.log(`Cleanup: removed ${staleConnections.length} stale connections`);
      }
    }, this.CLEANUP_INTERVAL);

    console.log(`SSE cleanup started (interval: ${this.CLEANUP_INTERVAL}ms)`);
  }

  /**
   * Get the number of active connections
   */
  getConnectionCount(): number {
    return this.clients.size;
  }

  /**
   * Get list of connected client IDs
   */
  getClientIds(): string[] {
    return Array.from(this.clients.keys());
  }

  /**
   * Get statistics
   */
  getStats(): SSEManagerStats {
    const uptime = Date.now() - this.stats.startTime;
    const uptimeSeconds = uptime / 1000;

    return {
      totalConnections: this.stats.totalConnections,
      activeConnections: this.clients.size,
      messagesSent: this.stats.messagesSent,
      messagesPerSecond: uptimeSeconds > 0 ? this.stats.messagesSent / uptimeSeconds : 0,
      averageLatency: 0, // TODO: Implement latency tracking
      errorCount: this.stats.errorCount,
    };
  }

  /**
   * Shutdown - close all connections and clear intervals
   */
  shutdown(): void {
    console.log('Shutting down SSE Manager...');

    // Stop heartbeat and cleanup
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    // Close all client connections
    this.clients.forEach((_, id) => {
      this.removeClient(id);
    });

    console.log('SSE Manager shutdown complete');
  }
}

// Singleton instance
export const sseManager = new SSEManager();

// Graceful shutdown on process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down SSE Manager...');
  sseManager.shutdown();
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down SSE Manager...');
  sseManager.shutdown();
});
