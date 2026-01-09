# LiveKit Real-time Transcription Research

## Summary

LiveKit **does support real-time transcription** through their Agents framework, but the open-source Server SDK **does not provide direct API methods** to retrieve historical transcripts. The transcription feature in LiveKit Cloud Dashboard is part of their proprietary observability infrastructure.

## How LiveKit Transcription Works

### 1. Real-time Transcription Delivery

- **Text Streams**: Transcriptions are delivered as real-time text streams with the topic `lk.transcription`
- **Segment-based**: Speech is split into segments, each with a unique ID
- **Two Streams per Segment**:
  - `interim_stream`: Partial transcriptions while processing
  - `final stream`: Complete transcription for the segment
- **Attributes**: Includes `lk.transcribed_track_id` and sender identity (transcribed participant)

### 2. Agent Integration

- Uses the `AgentSession` class with STT (Speech-to-Text) models
- Supports multiple providers: Deepgram, AssemblyAI, LiveKit Inference
- Transcriptions published to frontend in real-time
- Agent speech also transcribed and synced with audio playback

### 3. Client-Side Access

```typescript
// Frontend SDKs can receive transcription events
// using registerTextStreamHandler method
```

## LiveKit Cloud Dashboard Transcription Feature

### How It Works

1. **Agent Observability Stack**:
   - Built into LiveKit Cloud (proprietary)
   - Unified timeline with transcripts, traces, logs, and audio recordings
   - Enabled by default when using AgentSession

2. **Data Collection**:
   - Audio recordings collected for each agent session
   - Transcripts collected locally during session
   - Uploaded to LiveKit Cloud after session ends

3. **Storage & Retention**:
   - Stored in US region
   - 30-day retention window
   - Automatic deletion after 30 days

4. **Access**:
   - Available in "Agent insights" tab in Sessions Dashboard
   - Can download audio, transcript, and logs
   - Playback in browser
   - Future: Auto-export to your own cloud storage

## Implementing Transcription in Self-Hosted Dashboard

### Option 1: Real-time Client-Side Capture (Recommended)

**Approach**: Use LiveKit client SDK to capture transcription streams in real-time

```typescript
// In your frontend application
import { Room, RoomEvent } from 'livekit-client';

const room = new Room();

// Listen for transcription data
room.on(RoomEvent.TranscriptionReceived, (transcription) => {
  // Send to your backend API for storage
  fetch('/api/transcriptions', {
    method: 'POST',
    body: JSON.stringify({
      roomName: room.name,
      participantId: transcription.participantIdentity,
      trackId: transcription.trackId,
      segmentId: transcription.segmentId,
      text: transcription.text,
      isFinal: transcription.isFinal,
      timestamp: Date.now()
    })
  });
});
```

**Pros**:
- Real-time capture
- No dependency on LiveKit Cloud
- Full control over data storage
- Can implement custom retention policies

**Cons**:
- Requires frontend to be active
- Need to implement storage backend
- Historical data requires custom database

### Option 2: WebSocket Proxy (Advanced)

**Approach**: Create a backend service that connects as a participant and captures transcriptions

```typescript
// Backend service
import { Room, RoomEvent } from 'livekit-client';

async function captureTranscriptions(roomName: string) {
  const room = new Room();
  const token = await createTranscriptionBotToken(roomName);

  await room.connect(livekitUrl, token);

  room.on(RoomEvent.TranscriptionReceived, async (transcription) => {
    // Store in database
    await db.transcriptions.create({
      roomName,
      participantId: transcription.participantIdentity,
      text: transcription.text,
      timestamp: new Date()
    });
  });
}
```

**Pros**:
- Reliable capture even if no frontend clients
- Centralized storage
- Can run as background service

**Cons**:
- More complex implementation
- Requires bot participant management
- Additional server resources

### Option 3: LiveKit Egress (For Recordings)

**Approach**: Use LiveKit Egress service to record sessions and post-process

```bash
# Start recording with Egress
lk egress start --type room-composite --room my-room
```

**Pros**:
- Official LiveKit feature
- Works with existing infrastructure

**Cons**:
- Post-session processing only (not real-time)
- Requires separate transcription service
- More complex pipeline

## Recommended Implementation Plan

### Phase 1: Basic Real-time Display (No Storage)

1. Use `livekit-client` SDK in frontend
2. Display transcriptions in real-time during active sessions
3. No historical data - transcriptions disappear when session ends

**Effort**: Low (2-3 hours)
**Value**: Medium (live transcription visibility)

### Phase 2: Backend Storage & History

1. Implement transcription storage API in backend
2. Create database schema for transcriptions
3. Frontend sends transcription events to backend API
4. Add UI to view historical transcriptions

**Effort**: Medium (5-8 hours)
**Value**: High (full transcript history)

### Phase 3: Advanced Features

1. Search through transcriptions
2. Export transcriptions (TXT, JSON, SRT)
3. Sentiment analysis
4. Speaker identification
5. Integration with agent metadata

**Effort**: High (10-15 hours)
**Value**: Very High (professional features)

## Database Schema (For Phase 2)

```sql
CREATE TABLE transcriptions (
  id SERIAL PRIMARY KEY,
  room_sid VARCHAR(255) NOT NULL,
  room_name VARCHAR(255) NOT NULL,
  participant_id VARCHAR(255) NOT NULL,
  track_id VARCHAR(255),
  segment_id VARCHAR(255),
  text TEXT NOT NULL,
  is_final BOOLEAN DEFAULT false,
  is_agent BOOLEAN DEFAULT false,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  INDEX idx_room_sid (room_sid),
  INDEX idx_room_name (room_name),
  INDEX idx_participant (participant_id),
  INDEX idx_timestamp (timestamp)
);
```

## API Endpoints (For Phase 2)

```typescript
// Store transcription
POST /api/transcriptions
{
  roomName: string;
  roomSid: string;
  participantId: string;
  text: string;
  isFinal: boolean;
  timestamp: number;
}

// Get room transcriptions
GET /api/rooms/:roomName/transcriptions
Response: Transcription[]

// Get session transcriptions
GET /api/sessions/:sessionId/transcriptions
Response: Transcription[]
```

## Conclusion

**Can we implement real-time transcriptions?**
✅ **Yes, but with custom implementation**

The open-source LiveKit Server SDK doesn't provide transcript retrieval APIs like LiveKit Cloud does. However, we can implement our own solution using:

1. LiveKit client SDK to capture real-time transcription streams
2. Custom backend API to store transcriptions
3. Database to maintain historical data
4. UI components to display transcriptions

This gives us full control and doesn't require LiveKit Cloud subscription, but requires additional development effort.

## Next Steps

1. Decide if transcription feature is needed for MVP
2. Choose implementation approach (Phase 1, 2, or 3)
3. If yes, start with Phase 1 (real-time display only)
4. Iterate to Phase 2 (storage) based on user feedback
