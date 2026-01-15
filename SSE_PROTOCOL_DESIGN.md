# SSE Protocol Design - Real-Time Event System

## Overview

This document defines the Server-Sent Events (SSE) protocol for real-time communication between the LiveKit Dashboard backend and frontend clients.

## Message Format

### Base SSE Message Structure

All SSE messages follow the standard Server-Sent Events format:

```
event: <event-type>
data: <json-payload>
id: <message-id>

```

### JSON Payload Schema

```typescript
interface SSEMessage {
  // Event identification
  id: string;                    // Unique message ID (UUID v4)
  type: 'livekit' | 'system';   // Message category
  event: string;                 // Specific event name
  timestamp: number;             // Unix timestamp (milliseconds)

  // Event data
  data: {
    room?: RoomEventData;
    participant?: ParticipantEventData;
    track?: TrackEventData;
    // ... other event-specific data
  };

  // Metadata
  metadata?: {
    source: 'webhook' | 'internal';
    version: string;              // Protocol version (e.g., "1.0.0")
  };
}
```

## Event Types

### System Events

These are control/status messages from the backend:

#### 1. Connection Events

**`connected`** - Initial connection established
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "system",
  "event": "connected",
  "timestamp": 1704067200000,
  "data": {
    "connectionId": "conn_abc123",
    "serverVersion": "1.0.0",
    "supportedEvents": [
      "room_started",
      "room_finished",
      "participant_joined",
      "participant_left",
      "track_published",
      "track_unpublished"
    ]
  },
  "metadata": {
    "source": "internal",
    "version": "1.0.0"
  }
}
```

**`heartbeat`** - Keep-alive ping (sent every 30 seconds)
```
: heartbeat

```
*Note: Heartbeats use SSE comment format (: prefix) to avoid triggering message handlers*

**`error`** - System error notification
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "type": "system",
  "event": "error",
  "timestamp": 1704067200000,
  "data": {
    "code": "CONNECTION_ERROR",
    "message": "Failed to process webhook event",
    "severity": "warning" | "error" | "critical"
  }
}
```

### LiveKit Events

These are webhook events from LiveKit server:

#### 1. Room Events

**`room_started`** - Room created and activated
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "type": "livekit",
  "event": "room_started",
  "timestamp": 1704067200000,
  "data": {
    "room": {
      "sid": "RM_abc123def456",
      "name": "daily-standup",
      "emptyTimeout": 300,
      "maxParticipants": 20,
      "creationTime": 1704067200,
      "metadata": "{\"project\":\"engineering\"}"
    }
  },
  "metadata": {
    "source": "webhook",
    "version": "1.0.0"
  }
}
```

**`room_finished`** - Room closed
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "type": "livekit",
  "event": "room_finished",
  "timestamp": 1704070800000,
  "data": {
    "room": {
      "sid": "RM_abc123def456",
      "name": "daily-standup"
    }
  }
}
```

#### 2. Participant Events

**`participant_joined`** - Participant connected to room
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440004",
  "type": "livekit",
  "event": "participant_joined",
  "timestamp": 1704067230000,
  "data": {
    "room": {
      "sid": "RM_abc123def456",
      "name": "daily-standup"
    },
    "participant": {
      "sid": "PA_participant001",
      "identity": "user@example.com",
      "name": "John Doe",
      "state": "ACTIVE",
      "metadata": "{\"role\":\"presenter\"}",
      "joinedAt": 1704067230
    }
  }
}
```

**`participant_left`** - Participant disconnected from room
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005",
  "type": "livekit",
  "event": "participant_left",
  "timestamp": 1704070800000,
  "data": {
    "room": {
      "sid": "RM_abc123def456",
      "name": "daily-standup"
    },
    "participant": {
      "sid": "PA_participant001",
      "identity": "user@example.com"
    }
  }
}
```

#### 3. Track Events

**`track_published`** - Participant published a media track
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440006",
  "type": "livekit",
  "event": "track_published",
  "timestamp": 1704067250000,
  "data": {
    "room": {
      "sid": "RM_abc123def456",
      "name": "daily-standup"
    },
    "participant": {
      "sid": "PA_participant001",
      "identity": "user@example.com"
    },
    "track": {
      "sid": "TR_video001",
      "type": "video",
      "source": "camera",
      "muted": false
    }
  }
}
```

**`track_unpublished`** - Participant unpublished a media track
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440007",
  "type": "livekit",
  "event": "track_unpublished",
  "timestamp": 1704070750000,
  "data": {
    "room": {
      "sid": "RM_abc123def456",
      "name": "daily-standup"
    },
    "participant": {
      "sid": "PA_participant001",
      "identity": "user@example.com"
    },
    "track": {
      "sid": "TR_video001",
      "type": "video"
    }
  }
}
```

## Protocol Features

### 1. Message Identification

- Every message has a unique `id` field (UUID v4)
- Clients should track received IDs to detect duplicates
- Messages can be replayed using ID for debugging

### 2. Event Ordering

- Messages are sent in chronological order
- `timestamp` field ensures client-side ordering
- No guaranteed delivery order across network

### 3. Heartbeat Mechanism

- Server sends `: heartbeat\n\n` every 30 seconds
- Keeps connection alive through proxies/load balancers
- Client detects connection death if no heartbeat for 60 seconds

### 4. Error Handling

- System errors are sent as `system:error` events
- Non-critical errors don't close connection
- Critical errors close connection with error message

### 5. Versioning

- Protocol version in metadata (`version: "1.0.0"`)
- Clients check version on connect
- Incompatible versions should reconnect

## Client Implementation Requirements

### 1. Connection Setup

```typescript
const eventSource = new EventSource('/api/events');

eventSource.onopen = () => {
  console.log('SSE connected');
};

eventSource.onmessage = (event) => {
  const message: SSEMessage = JSON.parse(event.data);
  handleMessage(message);
};

eventSource.onerror = () => {
  console.error('SSE error, reconnecting...');
  // Implement reconnection logic
};
```

### 2. Message Handling

```typescript
function handleMessage(message: SSEMessage) {
  // Deduplicate
  if (receivedMessageIds.has(message.id)) {
    return; // Already processed
  }
  receivedMessageIds.add(message.id);

  // Route by type and event
  if (message.type === 'system') {
    handleSystemEvent(message);
  } else if (message.type === 'livekit') {
    handleLivekitEvent(message);
  }
}
```

### 3. Heartbeat Monitoring

```typescript
let lastHeartbeat = Date.now();

// On any message received (including heartbeat comments)
eventSource.addEventListener('message', () => {
  lastHeartbeat = Date.now();
});

// Check heartbeat every 10 seconds
setInterval(() => {
  if (Date.now() - lastHeartbeat > 60000) {
    console.warn('No heartbeat for 60s, reconnecting...');
    reconnect();
  }
}, 10000);
```

### 4. Reconnection Logic

```typescript
let reconnectDelay = 1000;        // Start with 1 second
const maxReconnectDelay = 30000;  // Cap at 30 seconds
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;

function reconnect() {
  if (reconnectAttempts >= maxReconnectAttempts) {
    console.error('Max reconnection attempts reached');
    showPermanentError();
    return;
  }

  reconnectAttempts++;

  setTimeout(() => {
    console.log(`Reconnecting (attempt ${reconnectAttempts})...`);
    eventSource.close();
    eventSource = new EventSource('/api/events');
    setupEventSource(eventSource);
  }, reconnectDelay);

  // Exponential backoff
  reconnectDelay = Math.min(reconnectDelay * 2, maxReconnectDelay);
}

// Reset on successful connection
eventSource.onopen = () => {
  reconnectDelay = 1000;
  reconnectAttempts = 0;
};
```

## Server Implementation Requirements

### 1. Connection Management

```typescript
class SSEManager {
  private clients = new Map<string, Response>();

  addClient(connectionId: string, res: Response) {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // For nginx

    // Add to active clients
    this.clients.set(connectionId, res);

    // Send connected event
    this.sendToClient(connectionId, {
      id: uuid(),
      type: 'system',
      event: 'connected',
      timestamp: Date.now(),
      data: { connectionId }
    });
  }

  removeClient(connectionId: string) {
    this.clients.delete(connectionId);
  }

  broadcast(message: SSEMessage) {
    const data = `data: ${JSON.stringify(message)}\n\n`;
    this.clients.forEach((res, id) => {
      try {
        res.write(data);
      } catch (error) {
        console.error(`Failed to send to ${id}:`, error);
        this.removeClient(id);
      }
    });
  }
}
```

### 2. Heartbeat Implementation

```typescript
// Send heartbeat every 30 seconds
setInterval(() => {
  sseManager.broadcast(':  heartbeat\n\n');
}, 30000);
```

### 3. Webhook-to-SSE Bridge

```typescript
// In webhook handler
router.post('/webhooks/livekit', async (req, res) => {
  try {
    const event = await webhookReceiver.receive(
      req.body,
      req.headers['authorization']
    );

    // Transform to SSE message
    const sseMessage: SSEMessage = {
      id: uuid(),
      type: 'livekit',
      event: event.event,
      timestamp: Date.now(),
      data: {
        room: event.room,
        participant: event.participant,
        track: event.track
      },
      metadata: {
        source: 'webhook',
        version: '1.0.0'
      }
    };

    // Broadcast to all connected clients
    sseManager.broadcast(sseMessage);

    res.status(200).send('OK');
  } catch (error) {
    res.status(400).send('Invalid webhook');
  }
});
```

## Performance Considerations

### 1. Connection Limits

- Max 100 concurrent connections per server instance
- Max 5 connections per user/IP
- Return 429 (Too Many Requests) when limit reached

### 2. Event Batching

- Batch events within 100ms window to reduce message flood
- Useful for rapid participant join/leave scenarios

### 3. Message Size

- Keep messages under 4KB for optimal performance
- Compress large metadata fields
- Consider pagination for large data sets

### 4. Memory Management

- Clean up disconnected clients immediately
- Track and limit message history (last 100 messages)
- Implement memory leak detection

## Security Considerations

### 1. Authentication (Optional for v1)

```typescript
router.get('/api/events', authenticateToken, (req, res) => {
  const userId = req.user.id;
  sseManager.addClient(userId, res);
});
```

### 2. Rate Limiting

- Limit connection attempts to 5 per minute per IP
- Track failed connections
- Implement IP-based blocking for abuse

### 3. Webhook Signature Verification

```typescript
const event = await webhookReceiver.receive(
  req.body,
  req.headers['authorization'] // Contains signature
);
// Signature verified by LiveKit SDK
```

## Testing Strategy

### 1. Unit Tests

- Test message serialization/deserialization
- Test heartbeat timing
- Test reconnection logic
- Test deduplication

### 2. Integration Tests

- Test webhook → SSE flow
- Test multiple client broadcasting
- Test client disconnection cleanup
- Test connection limits

### 3. Load Tests

- 100 concurrent connections
- 1000 events per minute
- Network interruption scenarios
- Memory leak detection (24-hour soak test)

## Migration Strategy

### Phase 1: Dual Mode (Polling + SSE)

- Deploy SSE alongside existing polling
- Polling as fallback
- 10% of users on SSE initially

### Phase 2: Gradual Rollout

- Increase SSE users to 50%
- Monitor errors and performance
- Tune reconnection parameters

### Phase 3: SSE Primary

- 100% SSE with polling fallback
- Remove polling code after stability confirmed

## Monitoring & Observability

### Key Metrics

1. **Connection Metrics**
   - Active SSE connections count
   - Connection duration (p50, p95, p99)
   - Connection errors rate

2. **Message Metrics**
   - Messages sent per second
   - Message broadcast latency (p50, p95, p99)
   - Message size distribution

3. **Error Metrics**
   - Client disconnections rate
   - Failed broadcasts count
   - Webhook processing errors

### Health Check

```http
GET /api/events/health
```

Response:
```json
{
  "status": "healthy",
  "connections": 42,
  "lastWebhook": "2024-01-14T12:00:00Z",
  "uptimeSeconds": 86400,
  "version": "1.0.0"
}
```

## Troubleshooting

### Common Issues

1. **Connection drops frequently**
   - Check heartbeat interval
   - Verify no proxy buffering
   - Check network stability

2. **Events not received**
   - Verify webhook configuration
   - Check SSE connection status
   - Verify no message filtering

3. **High memory usage**
   - Check for connection leaks
   - Verify client cleanup
   - Monitor client count

4. **Delayed events**
   - Check webhook delivery latency
   - Monitor broadcast performance
   - Verify no event batching issues

## Future Enhancements

### v2.0 Potential Features

1. **Event Filtering**
   - Client-side event subscriptions
   - Room-specific streams
   - Participant-specific streams

2. **Compression**
   - Gzip compression for messages
   - Binary format for performance

3. **History Replay**
   - Replay missed events on reconnect
   - Event ID-based resumption

4. **Multi-Server Support**
   - Redis pub/sub for server coordination
   - Sticky sessions for load balancing

## References

- [Server-Sent Events Specification](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [LiveKit Webhooks Documentation](https://docs.livekit.io/realtime/server/webhooks/)
- [EventSource API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
