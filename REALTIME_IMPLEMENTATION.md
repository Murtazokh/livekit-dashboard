# Real-Time Updates Implementation Guide

## Current Implementation (Polling)

The dashboard currently uses **polling** with React Query:
- Frontend fetches data every 60 seconds (`refetchInterval: 60000`)
- Additional refetch on window focus
- Not truly real-time - there's a delay between events and UI updates

## Best Practices for Real-Time Updates

LiveKit provides **three approaches** for real-time updates. Here's the recommended strategy:

---

## ✅ Recommended: LiveKit Webhooks + Server-Sent Events (SSE)

### Architecture

```
LiveKit Server → Webhooks → Your Backend → SSE → Frontend
```

### Why This Approach?

1. **True real-time** - Events pushed as they happen
2. **Efficient** - No polling overhead
3. **Scalable** - LiveKit handles the heavy lifting
4. **Complete** - All room events (join, leave, track published, etc.)

### Implementation Steps

#### 1. Backend: Set Up Webhook Handler

```typescript
// backend/src/routes/webhooks.ts
import express from 'express';
import { WebhookReceiver } from 'livekit-server-sdk';

const router = express.Router();
const webhookReceiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

// Store active SSE clients
const sseClients = new Set<express.Response>();

router.post('/livekit', async (req, res) => {
  try {
    // Verify webhook signature
    const event = await webhookReceiver.receive(
      req.body,
      req.headers['authorization'] as string
    );

    // Broadcast event to all connected SSE clients
    broadcastToClients({
      type: event.event,
      data: event,
      timestamp: Date.now()
    });

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send('Invalid webhook');
  }
});

// SSE endpoint for frontend
router.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Add client to active connections
  sseClients.add(res);

  // Remove client on disconnect
  req.on('close', () => {
    sseClients.delete(res);
  });

  // Send initial connection message
  res.write('data: {"type":"connected"}\n\n');
});

function broadcastToClients(event: any) {
  sseClients.forEach(client => {
    client.write(`data: ${JSON.stringify(event)}\n\n`);
  });
}

export default router;
```

#### 2. Configure LiveKit Webhooks

Add webhook URL to your LiveKit server configuration:

```yaml
# livekit.yaml
webhook:
  urls:
    - https://your-dashboard-domain.com/api/webhooks/livekit
  api_key: your-livekit-api-key
```

Or via LiveKit Cloud dashboard:
1. Go to Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/webhooks/livekit`
3. Select events to receive

#### 3. Frontend: Connect to SSE

```typescript
// frontend/src/hooks/useRealtimeEvents.ts
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface RealtimeEvent {
  type: string;
  data: any;
  timestamp: number;
}

export const useRealtimeEvents = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('/api/events');

    eventSource.onopen = () => {
      console.log('SSE connected');
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      const data: RealtimeEvent = JSON.parse(event.data);

      switch (data.type) {
        case 'room_started':
        case 'room_finished':
          // Invalidate rooms query to refetch
          queryClient.invalidateQueries({ queryKey: ['rooms'] });
          break;

        case 'participant_joined':
        case 'participant_left':
          // Invalidate specific room query
          queryClient.invalidateQueries({
            queryKey: ['rooms', data.data.room.name]
          });
          break;

        case 'track_published':
        case 'track_unpublished':
          // Invalidate participants query
          queryClient.invalidateQueries({
            queryKey: ['participants', data.data.room.name]
          });
          break;
      }
    };

    eventSource.onerror = () => {
      console.error('SSE connection error');
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);

  return { isConnected };
};
```

#### 4. Update Dashboard Component

```typescript
// frontend/src/presentation/pages/Dashboard.tsx
import { useRealtimeEvents } from '../hooks/useRealtimeEvents';

export const Dashboard = () => {
  const { isConnected } = useRealtimeEvents();
  const { data: rooms } = useRooms();

  return (
    <PageContainer>
      {/* Show real-time indicator */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
        <span className="text-sm">
          {isConnected ? 'Live' : 'Connecting...'}
        </span>
      </div>

      {/* Rest of dashboard */}
    </PageContainer>
  );
};
```

---

## Alternative: WebSocket Approach

If you want bidirectional communication:

### Using Socket.io

```typescript
// backend/src/server.ts
import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Emit events from webhook handler
export function emitRoomEvent(event: any) {
  io.emit('room:event', event);
}
```

```typescript
// frontend/src/hooks/useWebSocket.ts
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

export const useWebSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('room:event', (event) => {
      // Invalidate queries based on event type
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
};
```

---

## Alternative: LiveKit Client SDK Events

For **room-specific** real-time updates when viewing a single room:

```typescript
// frontend/src/hooks/useRoomConnection.ts
import { useEffect, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client';

export const useRoomConnection = (roomName: string, token: string) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const room = new Room();

    room
      .on(RoomEvent.ParticipantConnected, (participant) => {
        console.log('Participant joined:', participant.identity);
        setParticipants(prev => [...prev, participant]);
      })
      .on(RoomEvent.ParticipantDisconnected, (participant) => {
        console.log('Participant left:', participant.identity);
        setParticipants(prev =>
          prev.filter(p => p.identity !== participant.identity)
        );
      })
      .on(RoomEvent.TrackPublished, (publication, participant) => {
        console.log('Track published:', publication.trackSid);
      });

    room.connect('ws://your-livekit-server', token);

    return () => {
      room.disconnect();
    };
  }, [roomName, token]);

  return { participants };
};
```

---

## Comparison

| Approach | Real-time | Scalability | Complexity | Use Case |
|----------|-----------|-------------|------------|----------|
| **Polling** (current) | ❌ | ⚠️ Medium | ✅ Low | Simple dashboards |
| **SSE + Webhooks** | ✅ | ✅ High | ⚠️ Medium | **Recommended** |
| **WebSocket** | ✅ | ✅ High | ⚠️ Medium | Bidirectional needs |
| **LiveKit Client** | ✅ | ⚠️ Limited | ✅ Low | Single room view |

---

## Recommended Implementation Plan

### Phase 1: Reduce Polling Frequency
```typescript
// Increase refetchInterval to reduce load
refetchInterval: 5 * 60 * 1000, // 5 minutes instead of 60 seconds
```

### Phase 2: Add SSE Support
1. Implement SSE endpoint in backend
2. Connect frontend to SSE stream
3. Invalidate React Query cache on events
4. Keep polling as fallback

### Phase 3: Add Webhook Support
1. Configure LiveKit webhooks
2. Verify webhook signatures
3. Broadcast events via SSE
4. Remove polling entirely

### Phase 4: Polish
1. Add connection status indicator
2. Handle reconnection logic
3. Add event filtering
4. Implement optimistic updates

---

## Testing Real-Time Events

### 1. Test Webhooks Locally

Use ngrok to expose your local backend:

```bash
ngrok http 3001
```

Add the ngrok URL to LiveKit webhooks:
```
https://abc123.ngrok.io/api/webhooks/livekit
```

### 2. Test SSE Connection

```bash
curl -N http://localhost:3001/api/events
```

Should see:
```
data: {"type":"connected"}
```

### 3. Trigger Events

Create a test room in LiveKit to trigger events:
```bash
curl -X POST https://your-livekit-server/twirp/livekit.RoomService/CreateRoom \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"test-room"}'
```

---

## Production Considerations

### 1. Authentication

Secure SSE endpoint with tokens:

```typescript
router.get('/events', authenticateToken, (req, res) => {
  // Only authenticated users can subscribe
});
```

### 2. Rate Limiting

Limit SSE connections per user:

```typescript
const connectionCounts = new Map<string, number>();

router.get('/events', (req, res) => {
  const userId = req.user.id;
  const count = connectionCounts.get(userId) || 0;

  if (count >= 5) {
    return res.status(429).send('Too many connections');
  }

  connectionCounts.set(userId, count + 1);
  // ... rest of SSE setup
});
```

### 3. Heartbeat

Keep connections alive:

```typescript
const heartbeat = setInterval(() => {
  sseClients.forEach(client => {
    client.write(': heartbeat\n\n');
  });
}, 30000); // Every 30 seconds
```

### 4. Error Handling

Graceful degradation to polling:

```typescript
eventSource.onerror = () => {
  console.warn('SSE failed, falling back to polling');
  // Re-enable polling
  queryClient.setQueryDefaults(['rooms'], {
    refetchInterval: 60000
  });
};
```

---

## Resources

- [LiveKit Webhooks Documentation](https://docs.livekit.io/realtime/server/webhooks/)
- [Server-Sent Events (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [LiveKit Client SDK Events](https://docs.livekit.io/client-sdk-js/classes/Room.html#events)

---

## Next Steps

1. **Choose an approach** - SSE + Webhooks recommended
2. **Implement backend SSE endpoint** - Start with simple event stream
3. **Connect frontend** - Add `useRealtimeEvents` hook
4. **Test locally** - Use ngrok for webhook testing
5. **Deploy** - Configure production webhooks
6. **Monitor** - Track connection stability and event delivery

---

**Want help implementing this?** Let me know which approach you'd like to use and I can help you build it step by step!
