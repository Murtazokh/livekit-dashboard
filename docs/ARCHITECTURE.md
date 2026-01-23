# 🏗️ Project Architecture

## Overview

LiveKit Dashboard follows **Clean Architecture** principles, ensuring separation of concerns, testability, and maintainability. This document provides a comprehensive guide to the project structure and architectural decisions.

---

## 📂 Project Structure

```
livekit-dashboard/
├── frontend/                    # React application
│   ├── src/
│   │   ├── core/               # Business logic (Clean Architecture)
│   │   │   ├── domain/         # Domain entities
│   │   │   │   ├── Room.ts
│   │   │   │   ├── Participant.ts
│   │   │   │   ├── Agent.ts
│   │   │   │   └── Config.ts
│   │   │   ├── ports/          # Interface definitions
│   │   │   │   ├── ILiveKitService.ts
│   │   │   │   └── IConfigStorage.ts
│   │   │   └── usecases/       # Business logic
│   │   │       ├── GetRooms.ts
│   │   │       ├── GetParticipants.ts
│   │   │       └── ValidateConnection.ts
│   │   ├── infrastructure/     # External implementations
│   │   │   ├── api/
│   │   │   │   └── ApiClient.ts
│   │   │   └── storage/
│   │   │       └── LocalStorageConfig.ts
│   │   ├── presentation/       # UI layer
│   │   │   ├── components/     # Reusable UI components
│   │   │   │   ├── RoomCard.tsx
│   │   │   │   ├── ParticipantList.tsx
│   │   │   │   └── MetricsCard.tsx
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   │   ├── useRooms.ts
│   │   │   │   ├── useParticipants.ts
│   │   │   │   └── useApiClient.ts
│   │   │   ├── pages/          # Page components
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Sessions.tsx
│   │   │   │   └── Settings.tsx
│   │   │   └── providers/      # Context providers
│   │   │       └── ApiClientProvider.tsx
│   │   └── test/               # Test infrastructure
│   │       ├── __fixtures__/   # Test data
│   │       └── __mocks__/      # Mock implementations
│   └── vitest.config.ts
│
├── backend/                     # Express API server
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Express middleware
│   │   │   ├── extractLiveKitConfig.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimit.ts
│   │   ├── routes/             # API routes
│   │   │   └── api.ts
│   │   ├── services/           # Business logic
│   │   │   └── livekitService.ts
│   │   └── test/               # Test infrastructure
│   └── vitest.config.ts
│
├── docs/                        # Documentation
├── CLAUDE.md                    # Development guide for Claude Code
├── TESTING_SUMMARY.md           # Testing documentation
├── DOCKER.md                    # Docker deployment guide
└── README.md                    # Main documentation
```

---

## 🎯 Clean Architecture Layers

### 1. Domain Layer (`frontend/src/core/domain/`)

**Pure business entities with no external dependencies.**

```typescript
// Example: Room.ts
export interface Room {
  sid: string;
  name: string;
  numParticipants: number;
  creationTime: number;
  emptyTimeout: number;
  maxParticipants: number;
  metadata?: string;
}
```

**Characteristics:**
- No framework dependencies
- Pure TypeScript interfaces/types
- Represents business concepts
- Immutable by design

### 2. Ports Layer (`frontend/src/core/ports/`)

**Interface definitions for external services.**

```typescript
// Example: ILiveKitService.ts
export interface ILiveKitService {
  getRooms(): Promise<Room[]>;
  getParticipants(roomName: string): Promise<Participant[]>;
  validateConnection(config: Config): Promise<boolean>;
}
```

**Characteristics:**
- Defines contracts for external dependencies
- No implementation details
- Enables dependency inversion
- Makes code testable

### 3. Use Cases Layer (`frontend/src/core/usecases/`)

**Business logic orchestration.**

```typescript
// Example: GetRooms.ts
export class GetRooms {
  constructor(private livekitService: ILiveKitService) {}

  async execute(filters?: RoomFilters): Promise<Room[]> {
    const rooms = await this.livekitService.getRooms();
    return this.applyFilters(rooms, filters);
  }

  private applyFilters(rooms: Room[], filters?: RoomFilters): Room[] {
    // Filtering logic
  }
}
```

**Characteristics:**
- Orchestrates business logic
- Depends only on ports (interfaces)
- Framework-agnostic
- Easily testable

### 4. Infrastructure Layer (`frontend/src/infrastructure/`)

**Concrete implementations of ports.**

```typescript
// Example: ApiClient.ts
export class ApiClient implements ILiveKitService {
  async getRooms(): Promise<Room[]> {
    const response = await fetch(`${this.baseUrl}/api/rooms`);
    return response.json();
  }
}
```

**Characteristics:**
- Implements port interfaces
- Handles external communication
- Framework-specific code allowed
- Swappable implementations

### 5. Presentation Layer (`frontend/src/presentation/`)

**UI components, hooks, and React-specific code.**

```typescript
// Example: useRooms.ts
export const useRooms = () => {
  const { apiClient, isInitialized } = useApiClient();

  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const useCase = new GetRooms(apiClient);
      return useCase.execute();
    },
    enabled: isInitialized,
  });
};
```

**Characteristics:**
- React components and hooks
- UI state management
- User interaction handling
- Framework-dependent

---

## 🔄 Data Flow

### Request Flow

```
User Action (UI)
    ↓
React Hook (useRooms)
    ↓
Use Case (GetRooms)
    ↓
Port (ILiveKitService)
    ↓
Infrastructure (ApiClient)
    ↓
Backend API
    ↓
LiveKit Server
```

### Response Flow

```
LiveKit Server Response
    ↓
Backend Processing
    ↓
ApiClient (maps to domain entities)
    ↓
Use Case (applies business logic)
    ↓
React Query (caches result)
    ↓
React Hook (returns data)
    ↓
UI Component (renders)
```

---

## 🔐 Security Architecture

### Credential Flow

```
LocalStorage (browser)
    ↓
ApiClientProvider (loads on mount)
    ↓
ApiClient.initialize(config)
    ↓
HTTP Headers (X-LiveKit-Host, X-LiveKit-Key, X-LiveKit-Secret)
    ↓
Backend Middleware (extractLiveKitConfig)
    ↓
LiveKit SDK (makes authenticated request)
```

**Security Principles:**
1. **No Server Storage** - Credentials never persisted on backend
2. **Header-Based Transport** - Credentials in HTTP headers, not URL/body
3. **Browser-Only Storage** - localStorage keeps credentials client-side
4. **Stateless Backend** - Backend extracts credentials from each request
5. **Fallback to ENV** - Optional environment variables for testing

---

## 🎨 Frontend Architecture Patterns

### 1. ApiClient Provider Pattern

Solves circular dependency between configuration storage and API initialization.

```typescript
// ApiClientProvider.tsx
export const ApiClientProvider: React.FC = ({ children }) => {
  const [apiClient] = useState(() => new ApiClient());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const config = configStorage.getConfig();
    if (config) {
      apiClient.initialize(config);
      setIsInitialized(true);
    }
  }, []);

  return (
    <ApiClientContext.Provider value={{ apiClient, isInitialized }}>
      {children}
    </ApiClientContext.Provider>
  );
};
```

**Benefits:**
- Single ApiClient instance
- Automatic configuration loading
- Prevents circular dependencies
- Clean separation of concerns

### 2. React Query Integration

Smart data fetching with caching and revalidation.

```typescript
export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const useCase = new GetRooms(apiClient);
      return useCase.execute();
    },
    staleTime: 30000,           // Fresh for 30 seconds
    gcTime: 5 * 60 * 1000,      // Cache for 5 minutes
    refetchInterval: 60000,     // Auto-refresh every minute
    enabled: isInitialized,     // Only fetch when ready
  });
};
```

**Configuration:**
- `staleTime`: How long data is considered fresh
- `gcTime`: How long to keep unused data in cache
- `refetchInterval`: Auto-refresh interval for real-time feel
- `enabled`: Conditional fetching based on initialization state

### 3. Conditional Query Pattern

Prevents error spam before configuration is complete.

```typescript
const isConfigComplete = useConfigComplete();
const { isInitialized } = useApiClient();

return useQuery({
  // ...
  enabled: isConfigComplete() && isInitialized,
});
```

---

## 🔧 Backend Architecture

### Middleware Stack

```
Request
    ↓
CORS Middleware
    ↓
Rate Limiting
    ↓
Request Logger
    ↓
Extract LiveKit Config (from headers)
    ↓
Validate Config
    ↓
Route Handler
    ↓
LiveKit Service
    ↓
Error Handler (if needed)
    ↓
Response
```

### LiveKit Service

Thin wrapper around LiveKit SDK:

```typescript
export class LiveKitService {
  constructor(config: LiveKitConfig) {
    this.client = new RoomServiceClient(config.url, config.apiKey, config.apiSecret);
  }

  async listRooms(): Promise<Room[]> {
    const response = await this.client.listRooms();
    return response.map(this.mapToRoom);
  }
}
```

**Design Principles:**
- Stateless service creation (new instance per request)
- Direct mapping to LiveKit SDK methods
- Minimal business logic (proxy pattern)
- Error propagation to middleware

---

## 🧪 Testing Architecture

### Test Structure

```
frontend/src/test/
├── __fixtures__/          # Test data
│   ├── rooms.ts
│   └── participants.ts
├── __mocks__/            # Mock implementations
│   ├── MockLiveKitService.ts
│   └── MockConfigStorage.ts
└── setup.ts              # Test configuration
```

### Testing Patterns

**1. Use Case Testing:**
```typescript
describe('GetRooms', () => {
  it('should return all rooms when no filters applied', async () => {
    const mockService = new MockLiveKitService();
    const useCase = new GetRooms(mockService);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
  });
});
```

**2. Infrastructure Testing:**
```typescript
describe('LocalStorageConfig', () => {
  it('should save and retrieve config', () => {
    const storage = new LocalStorageConfig();
    const config = { serverUrl: 'ws://localhost:7880', ... };

    storage.saveConfig(config);
    const retrieved = storage.getConfig();

    expect(retrieved).toEqual(config);
  });
});
```

**3. API Testing:**
```typescript
describe('GET /api/rooms', () => {
  it('should return 200 with valid credentials', async () => {
    const response = await request(app)
      .get('/api/rooms')
      .set('X-LiveKit-Host', 'ws://localhost:7880')
      .set('X-LiveKit-Key', 'test-key')
      .set('X-LiveKit-Secret', 'test-secret');

    expect(response.status).toBe(200);
  });
});
```

---

## 🚀 Performance Considerations

### Frontend Optimizations

1. **React Query Caching** - Reduces unnecessary API calls
2. **Conditional Rendering** - Only render when data available
3. **Memoization** - Prevent unnecessary re-renders
4. **Lazy Loading** - (Planned) Route-based code splitting

### Backend Optimizations

1. **Stateless Design** - Easy horizontal scaling
2. **Rate Limiting** - Prevents abuse
3. **Efficient Middleware** - Minimal overhead
4. **Connection Pooling** - (Planned) Reuse LiveKit connections

---

## 🔮 Future Architecture Enhancements

### Planned Improvements

1. **WebSocket Integration** - Real-time updates without polling
2. **Offline Support** - Service worker and offline caching
3. **Database Layer** - Persist historical data
4. **Authentication** - Multi-user support with auth
5. **Plugin System** - Extensible architecture for custom features

---

## 📚 Additional Resources

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Query Documentation](https://tanstack.com/query/latest)
- [LiveKit Server SDK](https://docs.livekit.io/reference/server-sdks/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
