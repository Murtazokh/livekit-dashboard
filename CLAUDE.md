# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LiveKit Dashboard is an open-source, self-hosted alternative to LiveKit Cloud Dashboard for monitoring and managing LiveKit real-time communication infrastructure. The project uses a monorepo structure with separate frontend (React + TypeScript) and backend (Express + TypeScript) applications.

## Development Commands

### Root Level (Monorepo)
```bash
# Start both frontend and backend in development mode
npm run dev

# Build both applications
npm run build

# Type-check both applications
npm run type-check:frontend
npm run type-check:backend

# Lint
npm run lint:frontend

# Clean all dependencies and build artifacts
npm run clean
```

### Frontend (React + Vite)
```bash
cd frontend

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Format code
npm run format
npm run format:check
```

### Backend (Express + Node)
```bash
cd backend

# Start development server with hot reload (http://localhost:3001)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm run start

# Lint
npm run lint

# Format code
npm run format
npm run format:check
```

## Architecture

### Clean Architecture Implementation

The codebase follows Clean Architecture principles, especially on the frontend:

**Layer Structure:**
- **core/domain/**: Domain entities (Room, Participant, Agent, Config)
- **core/ports/**: Interface definitions (ILiveKitService, IConfigStorage)
- **core/usecases/**: Business logic (GetRooms, GetParticipants, ValidateConnection)
- **infrastructure/**: External implementations (ApiClient, LocalStorageConfig)
- **presentation/**: UI layer (components, hooks, pages, providers)

**Dependency Rule:** Dependencies point inward. Domain entities don't know about infrastructure or UI. Use cases depend on abstract ports, not concrete implementations.

### ApiClient Context Pattern (Circular Dependency Solution)

The project recently resolved circular dependencies between configuration storage and API client initialization using a provider pattern:

**Key Components:**
- `ApiClientProvider` (`frontend/src/presentation/providers/ApiClientProvider.tsx`): Context provider that creates a single ApiClient instance, loads configuration from LocalStorageConfig on mount, and initializes the ApiClient when config is available
- `useApiClient()` hook: Exposes the initialized ApiClient and initialization state to components
- `LocalStorageConfig`: Stores credentials in browser localStorage independently of ApiClient

**Initialization Flow:**
1. `ApiClientProvider` loads config from localStorage on mount
2. When config is available, calls `apiClient.initialize(config)`
3. Sets `isInitialized` flag to true
4. All hooks can now use the configured ApiClient via `useApiClient()`

### Backend Proxy Architecture

The backend acts as a thin security proxy between the frontend and LiveKit server:

**Request Flow:**
```
Frontend → ApiClient (adds headers) → Backend Middleware Chain → LiveKitService → LiveKit Server
```

**Middleware Stack:**
- `extractLiveKitConfig`: Extracts credentials from request headers (`X-LiveKit-Host`, `X-LiveKit-Key`, `X-LiveKit-Secret`). Converts WebSocket URLs (ws://, wss://) to HTTP URLs for SDK compatibility.
- `validateConfig`: Validates incoming configuration
- `rateLimit`: Prevents abuse
- `requestLogger`: Logs all requests
- `errorHandler`: Centralized error handling

**Security Design:**
- Credentials are NEVER stored on the backend
- Credentials are extracted fresh from each request's HTTP headers
- Backend falls back to environment variables if headers are missing (for development/testing)
- This design allows the backend to proxy requests without maintaining session state

### React Query Patterns

The frontend uses React Query (@tanstack/react-query) for data fetching with these patterns:

**Configuration:**
- `staleTime: 30000` (30 seconds) - Data is considered fresh for 30 seconds
- `gcTime: 5 * 60 * 1000` (5 minutes) - Cache kept for 5 minutes
- `refetchOnWindowFocus: true` - Refresh data when window gains focus
- `refetchInterval: 60000` (60 seconds) - Auto-refresh every minute for real-time feel

**Conditional Queries:**
- Queries use `enabled: isConfigComplete() && isInitialized` to prevent requests before configuration is set
- This prevents error spam when the app first loads without credentials

**Smart Retries:**
- 4xx errors don't retry (client errors indicate bad config)
- Other errors retry up to 3 times with exponential backoff (1s, 2s, 4s, max 30s)

**Query Key Factory:**
- Structured query keys like `['rooms', 'list', filters]` enable granular cache invalidation

### State Management

The project uses a combination of state management approaches:

**Configuration State:**
- Stored in browser localStorage via `LocalStorageConfig`
- Loaded once on app initialization
- Managed by `ApiClientProvider` context

**Server Data:**
- Managed by React Query
- Automatic caching, refetching, and background updates
- No Redux or similar state management needed for server data

**UI State:**
- Local React state (`useState`) for component-level UI state
- Context providers for shared state (ApiClientProvider)

## Configuration Management

### Frontend Configuration
Configuration is stored in browser localStorage and includes:
- `serverUrl`: LiveKit server URL (WebSocket or HTTP)
- `apiKey`: LiveKit API key
- `apiSecret`: LiveKit API secret

### Backend Configuration
Create `backend/.env` file (see `backend/.env.example`):
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Optional: Default credentials for testing (overridden by request headers)
# LIVEKIT_URL=ws://localhost:7880
# LIVEKIT_API_KEY=your-api-key
# LIVEKIT_API_SECRET=your-api-secret
```

## API Endpoints

Backend exposes these endpoints:
- `GET /api/rooms` - List all active rooms
- `GET /api/rooms/:roomName` - Get specific room details
- `GET /api/rooms/:roomName/participants` - List room participants
- `GET /api/rooms/:roomName/agents` - List room agents
- `POST /api/config/validate` - Validate LiveKit server credentials

## TypeScript Configuration

**Frontend:**
- TypeScript project references (see `tsconfig.json`)
- Strict mode enabled
- Vite for build and dev server
- ESM module format

**Backend:**
- Strict mode enabled with additional checks (`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`)
- CommonJS module format
- Compiles to `dist/` directory
- Source maps and declarations generated

## Key Architectural Decisions

1. **Ports/Interfaces First**: All external dependencies are accessed through interfaces (`ILiveKitService`, `IConfigStorage`), making the code testable and swappable.

2. **Provider Pattern for ApiClient**: Solves circular dependency between configuration storage and API initialization. Storage doesn't know about ApiClient, ApiClient doesn't know about storage—provider orchestrates both.

3. **Backend as Thin Proxy**: Backend doesn't store credentials or maintain session state. It extracts credentials from each request's headers and passes them to the LiveKit SDK. This keeps the backend stateless and simple.

4. **React Query Over Redux**: Server data is managed by React Query rather than Redux. This reduces boilerplate and provides better patterns for async data fetching, caching, and updates.

5. **Header-based Credential Transport**: Credentials flow from browser localStorage → ApiClient → HTTP headers → Backend → LiveKit SDK. This avoids storing credentials in request bodies or URL parameters.

6. **WebSocket URL Conversion**: The backend automatically converts WebSocket URLs (`ws://`, `wss://`) to HTTP URLs (`http://`, `https://`) because the LiveKit SDK requires HTTP URLs. Frontend users can enter either format.

## Working with the Codebase

### Adding a New API Endpoint

1. Define the interface in `frontend/src/core/ports/ILiveKitService.ts`
2. Implement in `frontend/src/infrastructure/api/ApiClient.ts`
3. Create a use case in `frontend/src/core/usecases/`
4. Add backend route in `backend/src/routes/api.ts`
5. Implement in `backend/src/services/livekitService.ts` using LiveKit SDK
6. Create a React Query hook in `frontend/src/presentation/hooks/`
7. Use the hook in your component

### Adding a New Configuration Field

1. Update the `Config` entity in `frontend/src/core/domain/Config.ts`
2. Update `IConfigStorage` interface in `frontend/src/core/ports/IConfigStorage.ts`
3. Update `LocalStorageConfig` implementation in `frontend/src/infrastructure/storage/LocalStorageConfig.ts`
4. Update Settings page form in `frontend/src/presentation/pages/Settings.tsx`
5. Update validation logic if needed

### Debugging Initialization Issues

If queries aren't running or ApiClient isn't initialized:
1. Check browser console for errors during ApiClientProvider mount
2. Verify localStorage has valid config: `localStorage.getItem('livekit-config')`
3. Check `isInitialized` state in ApiClientProvider
4. Verify `isConfigComplete()` returns true in your query hook
5. Check that `enabled` flag in useQuery is true

### Testing LiveKit Connection

Use the Settings page "Test Connection" button, which:
1. Creates a temporary ApiClient instance
2. Calls `ValidateConnection` use case
3. Makes a test request to `/api/rooms`
4. Returns detailed error messages if connection fails
5. Does NOT save credentials—validation happens before saving

## Common Patterns

### Creating a New Hook with React Query
```typescript
export const useNewFeature = () => {
  const { apiClient, isInitialized } = useApiClient();
  const isConfigComplete = useConfigComplete();

  return useQuery({
    queryKey: ['feature', 'key'],
    queryFn: async () => {
      const useCase = new GetFeature(apiClient);
      return useCase.execute();
    },
    enabled: isConfigComplete() && isInitialized,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      // Don't retry on client errors
      if (error instanceof Error && error.message.includes('400')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
```

### Creating a New Use Case
```typescript
import { ILiveKitService } from '../ports/ILiveKitService';
import { Result } from '../domain/types';

export class GetFeature {
  constructor(private livekitService: ILiveKitService) {}

  async execute(): Promise<Result> {
    try {
      return await this.livekitService.someMethod();
    } catch (error) {
      throw new Error(`Failed to get feature: ${error.message}`);
    }
  }
}
```

## Tech Stack Summary

**Frontend:**
- React 19 with hooks
- TypeScript (strict mode)
- Vite (build tool)
- Tailwind CSS 4
- React Query (data fetching)
- React Router 7
- LiveKit Client SDK

**Backend:**
- Node.js with Express 5
- TypeScript (strict mode)
- LiveKit Server SDK
- CORS, Helmet (security)
- dotenv (configuration)

## Notes

- There are no tests currently configured (test scripts exit with error)
- The project uses workspace configuration at the root level
- Prettier and ESLint are configured for both frontend and backend
- The backend uses nodemon for hot reload in development
- Frontend uses Vite's HMR for instant updates
