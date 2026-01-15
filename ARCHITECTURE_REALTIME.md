# Real-Time Updates Architecture

## System Overview

This document describes the architecture for real-time updates in the LiveKit Dashboard using Webhooks and Server-Sent Events (SSE).

## High-Level Architecture

```
┌─────────────────┐
│  LiveKit Server │
│                 │
│  - Rooms        │
│  - Participants │
│  - Tracks       │
└────────┬────────┘
         │
         │ Webhooks (HTTP POST)
         │ - room_started
         │ - room_finished
         │ - participant_joined
         │ - participant_left
         │ - track_published
         │ - track_unpublished
         │
         ▼
┌────────────────────────────────────┐
│   Dashboard Backend (Express)      │
│                                    │
│  ┌──────────────────────────────┐ │
│  │   Webhook Handler             │ │
│  │   POST /api/webhooks/livekit  │ │
│  │                               │ │
│  │  1. Verify signature          │ │
│  │  2. Parse event               │ │
│  │  3. Transform data            │ │
│  │  4. Broadcast via SSE         │ │
│  └──────────┬───────────────────┘ │
│             │                      │
│             ▼                      │
│  ┌──────────────────────────────┐ │
│  │   SSE Manager                 │ │
│  │                               │ │
│  │  - Manages client connections │ │
│  │  - Broadcasts events          │ │
│  │  - Sends heartbeats           │ │
│  │  - Handles disconnections     │ │
│  └──────────┬───────────────────┘ │
└─────────────┼────────────────────┘
              │
              │ Server-Sent Events (text/event-stream)
              │ GET /api/events
              │
         ┌────┴────┬────────┬────────┐
         │         │        │        │
         ▼         ▼        ▼        ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ...
    │Client 1│ │Client 2│ │Client 3│
    │        │ │        │ │        │
    │Browser │ │Browser │ │Browser │
    └────┬───┘ └────┬───┘ └────┬───┘
         │          │          │
         ▼          ▼          ▼
┌────────────────────────────────────┐
│   Dashboard Frontend (React)       │
│                                    │
│  ┌──────────────────────────────┐ │
│  │   useRealtimeEvents Hook      │ │
│  │                               │ │
│  │  1. Connect EventSource       │ │
│  │  2. Listen for messages       │ │
│  │  3. Parse event data          │ │
│  │  4. Invalidate React Query    │ │
│  └──────────┬───────────────────┘ │
│             │                      │
│             ▼                      │
│  ┌──────────────────────────────┐ │
│  │   React Query Cache           │ │
│  │                               │ │
│  │  - Rooms data                 │ │
│  │  - Participants data          │ │
│  │  - Track data                 │ │
│  └──────────┬───────────────────┘ │
│             │                      │
│             ▼                      │
│  ┌──────────────────────────────┐ │
│  │   UI Components               │ │
│  │                               │ │
│  │  - Dashboard                  │ │
│  │  - Sessions                   │ │
│  │  - Real-time indicator        │ │
│  └──────────────────────────────┘ │
└────────────────────────────────────┘
```

## Detailed Flow Diagrams

### 1. Initial Connection Flow

```
Frontend                     Backend                    LiveKit
   │                            │                           │
   │  1. User opens dashboard   │                           │
   │─────────────────────────▶  │                           │
   │                            │                           │
   │  2. Connect EventSource    │                           │
   │  GET /api/events           │                           │
   │───────────────────────────▶│                           │
   │                            │                           │
   │                            │  3. Add client to SSE     │
   │                            │     Manager               │
   │                            │                           │
   │  4. SSE connection open    │                           │
   │  HTTP 200 OK               │                           │
   │◀───────────────────────────│                           │
   │  Content-Type:             │                           │
   │  text/event-stream         │                           │
   │                            │                           │
   │  5. Connected event        │                           │
   │  data: {                   │                           │
   │    "type": "system",       │                           │
   │    "event": "connected"    │                           │
   │  }                         │                           │
   │◀───────────────────────────│                           │
   │                            │                           │
   │  6. Display "LIVE"         │                           │
   │     indicator              │                           │
   │                            │                           │
```

### 2. Room Creation Flow

```
LiveKit                Backend                    Frontend
   │                      │                           │
   │  1. Room created     │                           │
   │     event occurs     │                           │
   │                      │                           │
   │  2. Send webhook     │                           │
   │  POST /webhooks      │                           │
   │─────────────────────▶│                           │
   │  Body: {             │                           │
   │    event: "room_     │                           │
   │           started",  │                           │
   │    room: {...}       │                           │
   │  }                   │                           │
   │  Authorization:      │                           │
   │  <signature>         │                           │
   │                      │                           │
   │                      │  3. Verify signature      │
   │                      │                           │
   │                      │  4. Parse event           │
   │                      │                           │
   │                      │  5. Create SSE message    │
   │                      │                           │
   │                      │  6. Broadcast to all      │
   │                      │     connected clients     │
   │                      │                           │
   │                      │  7. Send SSE message      │
   │                      │───────────────────────────▶│
   │                      │  data: {                  │
   │                      │    type: "livekit",       │
   │                      │    event: "room_started", │
   │                      │    data: {room: {...}}    │
   │                      │  }                        │
   │                      │                           │
   │  8. Respond 200 OK   │                           │
   │◀─────────────────────│                           │
   │                      │                           │
   │                      │                           │  8. Parse message
   │                      │                           │
   │                      │                           │  9. Invalidate
   │                      │                           │     ['rooms'] cache
   │                      │                           │
   │                      │  10. Refetch rooms data   │
   │                      │◀───────────────────────────│
   │                      │  GET /api/rooms           │
   │                      │                           │
   │                      │  11. Return updated data  │
   │                      │───────────────────────────▶│
   │                      │                           │
   │                      │                           │  12. UI updates
   │                      │                           │      with new room
```

### 3. Participant Join Flow

```
LiveKit                Backend                    Frontend
   │                      │                           │
   │  Participant joins   │                           │
   │  room "meeting-1"    │                           │
   │                      │                           │
   │  Webhook POST        │                           │
   │─────────────────────▶│                           │
   │  event:              │                           │
   │  "participant_       │                           │
   │   joined"            │                           │
   │                      │                           │
   │                      │  Process & verify         │
   │                      │                           │
   │                      │  Broadcast SSE            │
   │                      │───────────────────────────▶│
   │                      │                           │
   │                      │                           │  Invalidate:
   │                      │                           │  - ['rooms']
   │                      │                           │  - ['rooms', 'meeting-1']
   │                      │                           │  - ['participants', 'meeting-1']
   │                      │                           │
   │                      │  Refetch queries          │
   │                      │◀───────────────────────────│
   │                      │                           │
   │                      │  Updated data             │
   │                      │───────────────────────────▶│
   │                      │                           │
   │                      │                           │  UI shows:
   │                      │                           │  - Updated participant count
   │                      │                           │  - New participant in list
```

### 4. Connection Recovery Flow

```
Frontend                     Backend
   │                            │
   │  Normal operation          │
   │◀──────────────────────────▶│
   │  SSE messages flowing      │
   │                            │
   │                            │
   │  Network interruption      │
   │  ✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗  │
   │                            │
   │  EventSource.onerror       │
   │  triggered                 │
   │                            │
   │  Show "DISCONNECTED"       │
   │  indicator                 │
   │                            │
   │  Wait 1 second             │
   │  (exponential backoff)     │
   │                            │
   │  Attempt reconnect #1      │
   │  GET /api/events           │
   │───────────────────────────▶│
   │  ✗ Failed                  │
   │                            │
   │  Wait 2 seconds            │
   │                            │
   │  Attempt reconnect #2      │
   │  GET /api/events           │
   │───────────────────────────▶│
   │  ✗ Failed                  │
   │                            │
   │  Wait 4 seconds            │
   │                            │
   │  Network restored          │
   │                            │
   │  Attempt reconnect #3      │
   │  GET /api/events           │
   │───────────────────────────▶│
   │  ✓ Success                 │
   │◀───────────────────────────│
   │                            │
   │  Show "LIVE" indicator     │
   │                            │
   │  Reset backoff delay       │
   │                            │
   │  Invalidate all caches     │
   │  to catch up on missed     │
   │  events                    │
   │                            │
```

### 5. Heartbeat Flow

```
Backend                Frontend (Client 1)      Frontend (Client 2)
   │                            │                        │
   │                            │                        │
   │  Every 30 seconds:         │                        │
   │                            │                        │
   │  Send heartbeat            │                        │
   │  ": heartbeat\n\n"         │                        │
   │───────────────────────────▶│                        │
   │───────────────────────────────────────────────────▶│
   │                            │                        │
   │                            │  Update lastHeartbeat  │
   │                            │  timestamp             │
   │                            │                        │
   │                            │                        │  Update lastHeartbeat
   │                            │                        │  timestamp
   │                            │                        │
   │  Every 10 seconds:         │                        │
   │                            │                        │
   │                            │  Check heartbeat age   │
   │                            │  if > 60s, reconnect   │
   │                            │                        │
```

## Component Details

### Backend Components

#### 1. Webhook Handler (`/api/webhooks/livekit`)

**Responsibilities:**
- Receive webhooks from LiveKit server
- Verify webhook signatures using LiveKit SDK
- Parse and validate webhook payloads
- Transform webhook data to SSE message format
- Broadcast events to SSE clients
- Respond with HTTP 200 on success

**Key Code:**
```typescript
router.post('/webhooks/livekit', async (req, res) => {
  try {
    const event = await webhookReceiver.receive(
      req.body,
      req.headers['authorization']
    );

    const sseMessage = transformWebhookToSSE(event);
    sseManager.broadcast(sseMessage);

    res.status(200).send('OK');
  } catch (error) {
    res.status(400).send('Invalid webhook');
  }
});
```

#### 2. SSE Manager (`services/sseManager.ts`)

**Responsibilities:**
- Maintain set of active client connections
- Add/remove clients on connect/disconnect
- Broadcast messages to all clients
- Send heartbeat pings every 30 seconds
- Handle client errors gracefully
- Track connection metrics

**State:**
```typescript
{
  clients: Map<connectionId, Response>,
  heartbeatInterval: NodeJS.Timer,
  connectionCount: number
}
```

**Key Methods:**
- `addClient(connectionId, response)`: Register new SSE client
- `removeClient(connectionId)`: Clean up disconnected client
- `broadcast(message)`: Send message to all clients
- `sendToClient(connectionId, message)`: Send to specific client
- `getConnectionCount()`: Get active connection count

#### 3. SSE Endpoint (`/api/events`)

**Responsibilities:**
- Accept EventSource connections
- Set proper SSE headers
- Generate unique connection ID
- Register client with SSE Manager
- Send initial "connected" event
- Handle client disconnection

**Headers Set:**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
X-Accel-Buffering: no
```

### Frontend Components

#### 1. useRealtimeEvents Hook

**Responsibilities:**
- Create and manage EventSource instance
- Track connection state
- Parse incoming SSE messages
- Invalidate React Query cache on events
- Implement reconnection logic with exponential backoff
- Deduplicate messages by ID
- Monitor heartbeat timing

**State:**
```typescript
{
  isConnected: boolean,
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error',
  lastEvent: Date | null,
  reconnectAttempts: number,
  receivedMessageIds: Set<string>
}
```

**Key Logic:**
```typescript
// On message received
const message = JSON.parse(event.data);

// Deduplicate
if (receivedMessageIds.has(message.id)) return;
receivedMessageIds.add(message.id);

// Invalidate cache based on event type
switch (message.event) {
  case 'room_started':
  case 'room_finished':
    queryClient.invalidateQueries(['rooms']);
    break;
  case 'participant_joined':
  case 'participant_left':
    queryClient.invalidateQueries(['rooms', message.data.room.name]);
    queryClient.invalidateQueries(['participants', message.data.room.name]);
    break;
}
```

#### 2. LiveIndicator Component

**Responsibilities:**
- Display real-time connection status
- Show visual indicator (colored dot with pulse)
- Display connection state text (LIVE, CONNECTING, DISCONNECTED)
- Show last event timestamp in tooltip
- Provide manual reconnect button on error

**States:**
- **Connected (Green)**: Actively receiving events
- **Connecting (Yellow)**: Attempting to establish connection
- **Disconnected (Gray)**: No active connection, will retry
- **Error (Red)**: Permanent failure, manual intervention needed

## Data Flow

### Event Processing Pipeline

```
1. LiveKit Server Event
   ↓
2. HTTP POST Webhook
   ↓
3. Backend Webhook Handler
   - Verify signature
   - Parse payload
   ↓
4. Transform to SSE Format
   - Add message ID
   - Add timestamp
   - Normalize data structure
   ↓
5. SSE Manager Broadcast
   - Iterate clients
   - Send to each connection
   - Handle errors
   ↓
6. Frontend EventSource.onmessage
   - Parse JSON
   - Deduplicate by ID
   ↓
7. React Query Cache Invalidation
   - Determine affected queries
   - Mark as stale
   - Trigger refetch
   ↓
8. API Request to Backend
   - Fetch updated data
   ↓
9. React Query Cache Update
   - Store new data
   - Notify subscribers
   ↓
10. UI Re-render
    - Components receive new data
    - Display updates
```

## Scalability Considerations

### Horizontal Scaling

For multiple backend instances:

```
                    ┌──────────────┐
                    │ Load Balancer│
                    │   (nginx)    │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐     ┌──────────┐     ┌──────────┐
    │Backend #1│     │Backend #2│     │Backend #3│
    │          │     │          │     │          │
    │SSE Mgr   │     │SSE Mgr   │     │SSE Mgr   │
    └────┬─────┘     └────┬─────┘     └────┬─────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   Redis     │
                   │   Pub/Sub   │
                   └─────────────┘
```

**Key Points:**
- Use sticky sessions to keep client on same backend
- Use Redis pub/sub to broadcast events across instances
- Webhooks go to any instance, Redis distributes to all

### Redis Pub/Sub Integration (Future)

```typescript
// Publisher (Webhook handler)
redis.publish('livekit-events', JSON.stringify(sseMessage));

// Subscriber (Each backend instance)
redis.subscribe('livekit-events', (message) => {
  const event = JSON.parse(message);
  sseManager.broadcast(event);
});
```

## Performance Metrics

### Target Performance

- **Connection Establishment**: < 100ms
- **Webhook Processing**: < 50ms
- **SSE Broadcast Latency**: < 50ms
- **End-to-End Latency** (webhook → UI update): < 500ms (p95)
- **Concurrent Connections**: 100 per instance
- **Event Throughput**: 1000 events/second per instance

### Monitoring

Key metrics to track:

1. **Backend**
   - Active SSE connections count
   - Webhook processing time (p50, p95, p99)
   - SSE broadcast time per message
   - Failed broadcasts count
   - Memory usage per connection

2. **Frontend**
   - Connection success rate
   - Reconnection attempts distribution
   - Message deduplication rate
   - Cache invalidation frequency
   - UI update latency

## Error Handling

### Backend Error Scenarios

| Error | Response | Recovery |
|-------|----------|----------|
| Invalid webhook signature | 400 Bad Request | LiveKit retries |
| Malformed webhook payload | 400 Bad Request | LiveKit retries |
| SSE broadcast failure | Log error, continue | Remove dead client |
| Client connection limit | 429 Too Many Requests | Client backs off |
| Server overload | 503 Service Unavailable | Client retries |

### Frontend Error Scenarios

| Error | Behavior | Recovery |
|-------|----------|----------|
| Initial connection fails | Show "Connecting" | Retry with backoff |
| Connection drops | Show "Disconnected" | Auto-reconnect |
| Max retries reached | Show "Error" + button | Manual reconnect |
| Parse error | Log, skip message | Continue |
| Browser doesn't support SSE | Fallback to polling | Graceful degradation |

## Security Architecture

### Defense Layers

```
1. Network Layer
   - HTTPS/TLS encryption
   - Rate limiting by IP

2. Application Layer
   - Webhook signature verification
   - Connection limit per user
   - Authentication (optional v1)

3. Data Layer
   - No sensitive data in SSE messages
   - Server-side authorization checks

4. Client Layer
   - CORS restrictions
   - Content Security Policy
```

### Webhook Security

```typescript
// Signature verification flow
const signature = req.headers['authorization'];
const isValid = webhookReceiver.verify(req.body, signature);

if (!isValid) {
  return res.status(400).send('Invalid signature');
}
// Proceed with event processing
```

## Testing Strategy

### Unit Tests

- SSE Manager: add/remove clients, broadcast
- Message transformation: webhook → SSE format
- Reconnection logic: exponential backoff timing
- Deduplication: message ID tracking

### Integration Tests

- Webhook → SSE → Frontend flow
- Multiple client broadcasting
- Client disconnection cleanup
- Cache invalidation triggers refetch

### Load Tests

- 100 concurrent SSE connections
- 1000 webhooks per minute
- Network interruption scenarios
- 24-hour stability test

### Manual Tests

- Browser support (Chrome, Firefox, Safari)
- Mobile browsers (iOS Safari, Chrome Android)
- Network throttling (3G, slow connection)
- Browser tab visibility changes

## Deployment Checklist

- [ ] Backend SSE endpoint deployed
- [ ] Webhook handler deployed
- [ ] Frontend SSE client deployed
- [ ] LiveKit webhook URL configured
- [ ] Webhook signature verification working
- [ ] Heartbeat mechanism active
- [ ] Connection limits configured
- [ ] Monitoring/metrics enabled
- [ ] Error alerting configured
- [ ] Documentation updated
- [ ] Load tests passed
- [ ] Security audit completed

## Rollback Plan

If issues arise:

1. **Disable feature flag** (frontend SSE disabled)
2. **Verify polling fallback** working
3. **Monitor error rates** returning to baseline
4. **Investigate root cause**
5. **Fix and redeploy** or wait for next release

## References

- SSE Protocol Design: `SSE_PROTOCOL_DESIGN.md`
- Implementation Guide: `REALTIME_IMPLEMENTATION.md`
- LiveKit Webhooks: https://docs.livekit.io/realtime/server/webhooks/
- EventSource API: https://developer.mozilla.org/en-US/docs/Web/API/EventSource
