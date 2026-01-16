# Agent API Limitations

## LiveKit Cloud vs Self-Hosted Agent Management

### What LiveKit Cloud Shows (Not Available in Public API)

LiveKit Cloud's dashboard shows "Agents Deployed" because they track agents deployed through their CLI (`lk agent deploy`). This data is stored in **LiveKit Cloud's internal infrastructure** and is **not available through the public LiveKit Server SDK**.

**LiveKit Cloud Features:**
- ✅ "Agents Deployed" count (workers registered via Cloud)
- ✅ Agent status: PENDING, ACTIVE, etc.
- ✅ Agent deployment history
- ✅ Agent configuration management through UI
- ✅ Concurrent agent sessions tracking

### What's Available in Public API (Self-Hosted)

The public LiveKit Server SDK (`livekit-server-sdk`) provides these APIs:

#### **AgentDispatchClient** (What we use):
- `listDispatch(roomName)` - List agent dispatches **in a specific room** (roomName required)
- `createDispatch(roomName, agentName, metadata)` - Dispatch agent to room
- `deleteDispatch(dispatchId, roomName)` - Remove agent dispatch
- `getDispatch(dispatchId, roomName)` - Get single dispatch

**⚠️ Limitation**: `listDispatch()` **requires a roomName** - there's no way to list all registered agent workers that aren't in rooms.

#### **RoomServiceClient**:
- `listRooms()` - List all active rooms
- `listParticipants(roomName)` - List participants (including agent participants)

### Our Dashboard Implementation

Since we can't query "deployed agents" directly, our dashboard shows:

**What We Show:**
1. **Active Agent Sessions** - Agents currently in rooms (via `listDispatch` per room)
2. **Agent Participants** - Agents that joined as participants
3. **Rooms with Agents** - Count of rooms containing agents

**How We Detect Agents:**
```typescript
// Method 1: Explicit Dispatches
const dispatches = await agentClient.listDispatch(roomName);

// Method 2: Agent Participants (agents join as special participants)
const participants = await roomClient.listParticipants(roomName);
const agentParticipants = participants.filter(p =>
  p.identity.startsWith('agent-') ||
  p.metadata?.includes('agent')
);
```

### Workarounds for Showing "Deployed Agents"

If you need to show agents like LiveKit Cloud does, you have these options:

#### **Option 1: Track Deployments in Database**
- Store agent deployments in your own database
- When creating dispatches via dashboard, save to DB
- Show agents from DB + reconcile with LiveKit

#### **Option 2: Use LiveKit Cloud**
- Deploy to LiveKit Cloud
- Use their management interface
- Benefit from their internal tracking

#### **Option 3: Polling All Rooms**
- Periodically query all rooms for agents (current implementation)
- Limited to agents that are **actively in rooms**
- Can't show "idle" or "pending" agents

### Recommended Workflow

For self-hosted LiveKit, the workflow is:

1. **Start Agent Worker** - Run your agent code (`python agent.py`)
2. **Create Room** - Create a room via dashboard or client
3. **Dispatch Agent** - Use our dashboard to dispatch agent to room
4. **See Agent** - Agent now appears in dashboard (in room)

The agent won't appear until it's **dispatched to a room** or **joins a room**.

### API References

- [AgentDispatchClient (JS)](https://docs.livekit.io/reference/server-sdk-js/classes/AgentDispatchClient.html)
- [Agent Dispatch Docs](https://docs.livekit.io/agents/server/agent-dispatch/)
- [LiveKit Cloud Deployment](https://docs.livekit.io/agents/ops/deployment/)

### Feature Request

If you need an API to list all registered agent workers, consider opening a feature request:
- [LiveKit GitHub Issues](https://github.com/livekit/livekit/issues)
- [LiveKit Agents GitHub](https://github.com/livekit/agents/issues)
