# LiveKit Dashboard - Task Checklist

## Phase 1: Foundation Setup

### 1.1 Project Initialization
- [x] Create monorepo structure (frontend/ and backend/ directories)
- [x] Initialize frontend with Vite + React + TypeScript
- [x] Initialize backend with Node.js + Express + TypeScript
- [x] Set up root package.json with workspace scripts
- [x] Create .gitignore files for frontend and backend

### 1.2 Frontend Configuration
- [x] Configure TypeScript strict mode (tsconfig.json)
- [x] Install core dependencies (react-router-dom, @tanstack/react-query, zustand)
- [x] Install UI dependencies (@livekit/components-react, tailwind, shadcn/ui)
- [x] Set up Tailwind CSS configuration
- [x] Configure Vite (proxy, environment variables)
- [x] Set up ESLint and Prettier

### 1.3 Backend Configuration
- [x] Configure TypeScript for Node.js (tsconfig.json)
- [x] Install dependencies (express, livekit-server-sdk, cors, dotenv)
- [x] Install dev dependencies (nodemon, @types/node, @types/express)
- [x] Create .env.example file
- [x] Set up ESLint and Prettier
- [x] Configure nodemon for hot reload

### 1.4 Project Structure Setup
- [x] Create frontend core/domain directory structure
- [x] Create frontend core/ports directory structure
- [x] Create frontend core/usecases directory structure
- [x] Create frontend infrastructure directory structure
- [x] Create frontend presentation directory structure
- [x] Create backend src directory structure (controllers, services, routes, middleware)
- [x] Create shared/types directory in frontend
- [x] Create types directory in backend

### 1.5 Core Type Definitions
- [x] Define Room domain model interface
- [x] Define Participant domain model interface
- [x] Define Agent domain model interface
- [x] Define ServerConfig interface
- [x] Define API response types
- [x] Define API error types
- [x] Create shared constants file

---

## Phase 2: Backend API Layer

### 2.1 Express Server Setup
- [x] Create basic Express server (src/server.ts)
- [x] Configure CORS middleware
- [x] Configure JSON body parser
- [x] Add request logging middleware
- [x] Set up error handling middleware
- [x] Configure environment variable loading
- [x] Test server starts successfully

### 2.2 LiveKit Service Implementation
- [x] Create LiveKitService class (src/services/livekitService.ts)
- [x] Implement connection initialization method
- [x] Implement listRooms method
- [x] Implement getRoomDetails method
- [x] Implement listParticipants method
- [x] Implement getAgents method (if available in SDK)
- [x] Add error handling for API calls
- [x] Test service with mock credentials

### 2.3 API Controllers
- [x] Create roomsController with listRooms endpoint handler
- [x] Create roomsController with getRoomDetails endpoint handler
- [x] Create participantsController with listParticipants endpoint handler
- [x] Create agentsController with listAgents endpoint handler
- [x] Add input validation for all controllers
- [x] Add error responses for all controllers

### 2.4 API Routes
- [x] Create main API router (src/routes/api.ts)
- [x] Define POST /api/config/validate endpoint
- [x] Define GET /api/rooms endpoint
- [x] Define GET /api/rooms/:roomName endpoint
- [x] Define GET /api/rooms/:roomName/participants endpoint
- [x] Define GET /api/rooms/:roomName/agents endpoint
- [ ] Add route-level middleware for validation

### 2.5 Middleware
- [x] Create validateConfig middleware (checks API credentials in headers)
- [x] Create errorHandler middleware (formats errors consistently)
- [x] Create requestLogger middleware (logs all requests)
- [x] Add rate limiting middleware
- [x] Test all middleware functions

### 2.6 Backend Testing
- [x] Test POST /api/config/validate returns success/error
- [x] Test GET /api/rooms returns list of rooms
- [x] Test GET /api/rooms/:roomName returns room details
- [x] Test GET /api/rooms/:roomName/participants returns participants
- [x] Test GET /api/rooms/:roomName/agents returns agents
- [x] Test error handling for invalid credentials
- [x] Test error handling for network failures

---

## Phase 3: Configuration & Connection

### 3.1 Core Port Interfaces
- [x] Create ILiveKitService interface (core/ports/)
- [x] Create IConfigStorage interface (core/ports/)
- [x] Create IRealtimeProvider interface (core/ports/)
- [x] Define method signatures for all interfaces
- [x] Add JSDoc comments to interfaces

### 3.2 Configuration Storage
- [x] Create LocalStorageConfig class (infrastructure/storage/)
- [x] Implement saveConfig method
- [x] Implement loadConfig method
- [x] Implement clearConfig method
- [x] Add encryption for sensitive data (optional)
- [x] Test storage persistence

### 3.3 API Client Implementation
- [x] Create ApiClient class (infrastructure/api/)
- [x] Implement validateConnection method
- [x] Implement getRooms method
- [x] Implement getRoomDetails method
- [x] Implement getParticipants method
- [x] Implement getAgents method
- [ ] Add request/response interceptors
- [ ] Add retry logic for failed requests
- [x] Test all API client methods

### 3.4 Connection Validation Use Case
- [x] Create ValidateConnection use case (core/usecases/)
- [x] Implement validation logic
- [x] Add error handling for invalid credentials
- [x] Add error handling for network issues
- [x] Test with valid credentials
- [x] Test with invalid credentials

### 3.5 Settings Page UI
- [x] Create Settings page component (presentation/pages/Settings.tsx)
- [x] Create ServerConfigForm component
- [x] Add form fields (server URL, API key, API secret)
- [x] Add form validation
- [x] Add submit button and loading state
- [x] Add success/error messages
- [x] Create useSettings hook for state management
- [x] Test form submission
- [x] Test validation rules

### 3.6 Settings Integration
- [x] Connect Settings form to LocalStorageConfig
- [x] Implement save configuration functionality
- [x] Implement load configuration on mount
- [x] Add connection test button
- [x] Show connection status indicator
- [x] Test end-to-end configuration flow

---

## Phase 4: Dashboard Core Features

### 4.1 Rooms Feature - Backend Integration
- [x] Create GetRooms use case (core/usecases/)
- [x] Implement business logic for rooms
- [x] Add filtering/sorting logic if needed
- [x] Test use case with mock data

### 4.2 Rooms Feature - Data Fetching
- [x] Create useRooms hook (presentation/hooks/)
- [x] Integrate React Query for data fetching
- [x] Configure cache time and stale time
- [x] Add refetch on window focus
- [x] Add error handling
- [x] Test hook with valid config
- [x] Test hook with invalid config

### 4.3 Rooms Feature - UI Components
- [x] Create RoomList component (presentation/components/rooms/)
- [x] Create RoomCard component
- [x] Add loading skeleton
- [x] Add empty state
- [x] Add error state
- [x] Style components with Tailwind
- [ ] Create RoomCard component
- [ ] Add room name, participant count, creation time
- [ ] Add loading skeleton
- [ ] Add empty state
- [ ] Add error state
- [ ] Style components with Tailwind
- [ ] Make components responsive
- [ ] Test all states (loading, error, empty, data)

### 4.4 Participants Feature - Backend Integration
- [ ] Create GetParticipants use case (core/usecases/)
- [ ] Implement business logic for participants
- [ ] Test use case with mock data

### 4.5 Participants Feature - Data Fetching
- [ ] Create useParticipants hook (presentation/hooks/)
- [ ] Integrate React Query for data fetching
- [ ] Configure cache settings
- [ ] Add error handling
- [ ] Test hook functionality

### 4.6 Participants Feature - UI Components
- [ ] Create ParticipantList component (presentation/components/participants/)
- [ ] Create ParticipantCard component
- [ ] Add participant identity, connection status
- [ ] Add loading skeleton
- [ ] Add empty state
- [ ] Add error state
- [ ] Style components
- [ ] Make responsive
- [ ] Test all states

### 4.7 Agents Feature - Backend Integration
- [ ] Create GetAgents use case (core/usecases/)
- [ ] Implement business logic for agents
- [ ] Test use case with mock data

### 4.8 Agents Feature - Data Fetching
- [ ] Create useAgents hook (presentation/hooks/)
- [ ] Integrate React Query for data fetching
- [ ] Configure cache settings
- [ ] Add error handling
- [ ] Test hook functionality

### 4.9 Agents Feature - UI Components
- [ ] Create AgentList component (presentation/components/agents/)
- [ ] Create AgentCard component
- [ ] Add agent status and metadata
- [ ] Add loading skeleton
- [ ] Add empty state
- [ ] Add error state
- [ ] Style components
- [ ] Make responsive
- [ ] Test all states

### 4.10 Dashboard Overview Page
- [x] Create Dashboard page component (presentation/pages/Dashboard.tsx)
- [x] Add metrics overview section (total rooms, participants, agents)
- [x] Integrate RoomList component
- [x] Add refresh button
- [x] Add last updated timestamp
- [x] Style with grid layout
- [x] Test page integration

---

## Phase 5: UI Redesign - LiveKit Cloud Dashboard Style

> **Reference**: See UI_REDESIGN_PLAN.md for detailed design specifications
> **Goal**: Transform UI to match LiveKit Cloud Dashboard professional aesthetic

### 5.1 Foundation - Dark Theme Design System
- [x] Create dark theme design tokens file (`frontend/src/styles/design-tokens.css`)
- [x] Update Tailwind config with new color palette:
  - Background: #000000 (pure black)
  - Card: #0F0F0F (very dark gray)
  - Border: #262626
  - Primary: #3B82F6 (blue)
  - Text colors: #FFFFFF, #A3A3A3
- [x] Define typography system (Inter/System font, 14px base)
- [x] Define spacing scale (4px base unit)
- [x] Define border radius values (4px, 8px, 12px)
- [x] Test dark theme colors for WCAG contrast compliance

### 5.2 Layout Structure - Sidebar Navigation
- [x] Create `AppLayout` component (`frontend/src/presentation/components/layout/AppLayout.tsx`)
- [x] Create `Sidebar` component with navigation items
  - Overview/Dashboard
  - Sessions
  - Settings
- [x] Add sidebar collapse/expand functionality
- [x] Implement responsive sidebar (drawer on mobile)
- [x] Create `Header` component with breadcrumbs
- [x] Create `PageContainer` wrapper component
- [x] Add smooth page transitions
- [x] Update App.tsx to use new AppLayout
- [ ] Test sidebar on all screen sizes

### 5.3 Sessions Data Table Component
- [x] Create reusable `DataTable` component (`frontend/src/presentation/components/table/DataTable.tsx`)
- [x] Create `TableHeader` component
- [x] Create `TableRow` component with hover states
- [x] Create `TableCell` component
- [x] Implement table columns for sessions:
  - Session ID (monospace)
  - Room name
  - Started at
  - Ended at
  - Duration
  - Participants
  - Features (badges)
  - Status (badge)
- [x] Add column sorting functionality
- [x] Add table skeleton loader
- [x] Add empty state for table
- [x] Style table to match LiveKit Cloud aesthetic
- [ ] Test table with various data scenarios

### 5.4 Metric Cards with Visualizations
- [x] Create `MetricCard` component (`frontend/src/presentation/components/metrics/MetricCard.tsx`)
- [x] Create `MiniChart` component for sparkline visualizations
- [x] Implement "Total rooms" metric card
- [x] Implement "Active participants" metric card
- [x] Implement "Active publishers" metric card
- [x] Calculate real metrics from rooms data
- [x] Add subtle hover animations
- [x] Create mock trend data for charts (or calculate from API)
- [x] Test metric cards responsiveness
- [x] Add trend indicators (up/down arrows with percentages)

### 5.5 Sessions Page (Dashboard Replacement)
- [x] Create dedicated Sessions.tsx page with DataTable
- [x] Replace RoomList cards with professional DataTable component
- [x] Add metric cards at top of page (Total Rooms, Participants, Publishers)
- [x] Integrate filter bar component with search and controls
- [x] Update page layout to match LiveKit Cloud aesthetic
- [x] Add page header with title, description, and LiveIndicator
- [x] Keep both Dashboard (/) and Sessions (/sessions) pages for flexibility
- [ ] Consider removing old RoomCard component (currently still used in Dashboard)
- [x] Test entire sessions page flow with metrics and filtering

### 5.6 Filters & Real-time Controls
- [x] Create `FilterBar` component (`frontend/src/presentation/components/filters/FilterBar.tsx`)
- [x] Create `TimeRangeSelect` dropdown component
  - Last hour
  - Last 24 hours
  - Last 7 days
  - Custom range
- [x] Create `SearchInput` component for filtering
- [x] Add refresh button
- [x] Add auto-refresh toggle switch
- [x] Add "Last updated" timestamp display (via LiveIndicator)
- [x] Add "Live" indicator with pulse animation (already implemented)
- [x] Connect filters to React Query
- [x] Implement search filtering logic (room name and SID)
- [ ] Implement time range filtering logic (TODO: needs historical data)
- [x] Test all filter combinations

### 5.7 Real-time Updates Configuration
- [x] Update React Query configuration in useRooms hook:
  - Set refetchInterval: 5000 (5 seconds)
  - Ensure refetchOnWindowFocus: true
  - Ensure refetchOnReconnect: true
- [x] Add visual feedback during data refresh
- [ ] Implement optimistic UI updates
- [ ] Add toast notifications for new rooms (optional)
- [x] Create `LiveIndicator` component with pulse animation
- [x] Test real-time updates work without page refresh
- [x] Verify no excessive API calls (pauses when tab not visible)

### 5.8 Status & Feature Badges
- [x] Update `StatusBadge` component to match LiveKit Cloud style
- [x] Add status variants:
  - ACTIVE (green with pulsing dot)
  - CLOSED (gray)
  - ERROR (red)
  - CONNECTING (yellow/warning)
  - SUCCESS, WARNING, INFO
- [x] Create `FeatureBadge` component for room features
  - Recording badge (red with dot icon)
  - SIP badge (blue with phone icon)
  - Agents badge (green with microphone icon)
  - Transcription badge (yellow with document icon)
- [x] Add icons to badges
- [x] Style badges to match reference design using design tokens
- [x] Test badges in table context (Sessions page)
- [x] Create ui components barrel export (index.ts)

### 5.9 Session Details View
- [ ] Create `SessionDetailsModal` component
- [ ] Add session metadata display
- [ ] Create `ParticipantsList` component using LiveKit SDK components
- [ ] Create `AgentsList` component
- [ ] Add connection timeline visualization (optional)
- [ ] Integrate with table row click
- [ ] Add close/dismiss functionality
- [ ] Style modal to match dark theme
- [ ] Test modal with real session data

### 5.10 LiveKit Official Components Integration
- [ ] Audit @livekit/components-react available components
- [ ] Use official ParticipantTile for participant displays
- [ ] Use official ConnectionQualityIndicator
- [ ] Use official AudioVisualizer if available
- [ ] Customize styling to match our dark theme
- [ ] Document which official components are used
- [ ] Test official components integration

### 5.11 Settings Page Redesign
- [x] Update Settings page to use PageContainer and match new dark theme
- [x] Reorganize settings into card-based sections (Server Configuration, Connection Status, Danger Zone)
- [x] Update page layout with proper spacing and animations
- [x] Add connection status indicator with StatusBadge
- [x] Improve loading state with LoadingSpinner component
- [x] Update Danger Zone styling with destructive theme colors
- [x] Test settings page with new theme

### 5.12 Loading & Empty States Polish
- [x] Create `TableSkeleton` component matching table structure (already implemented)
- [x] Create improved `EmptyState` component with better design
- [x] Add illustrations/icons to empty states
- [x] Add micro-animations for state transitions (fade-in, shimmer)
- [x] Update DataTable empty state with improved styling
- [x] Add shimmer animation to Tailwind config
- [x] Ensure consistent loading UX across all views
- [x] Test all loading and empty state scenarios

### 5.13 Responsive Design & Mobile
- [ ] Test data table on mobile (consider card fallback view)
- [ ] Implement responsive table (horizontal scroll or cards)
- [ ] Test sidebar drawer on mobile
- [ ] Test metric cards on mobile (stack vertically)
- [ ] Ensure touch-friendly hit targets (min 44px)
- [ ] Test all breakpoints: 320px, 768px, 1024px, 1440px
- [ ] Fix any mobile layout issues
- [ ] Test on real mobile devices

### 5.14 Performance & Accessibility
- [ ] Optimize bundle size and loading
- [ ] Add ARIA labels to table and interactive elements
- [ ] Implement keyboard navigation for table
- [ ] Add focus management for modals
- [ ] Test with screen reader
- [ ] Check color contrast ratios (WCAG AA)
- [ ] Test keyboard navigation throughout app
- [ ] Run Lighthouse accessibility audit

### 5.15 Final Polish & Testing
- [ ] Add subtle transitions and animations
- [ ] Verify typography consistency
- [ ] Check spacing consistency
- [ ] Test in Chrome, Firefox, Safari
- [ ] Take before/after screenshots
- [ ] Update README with new screenshots
- [ ] Update CLAUDE.md with new component patterns
- [ ] Document design system in markdown

---

## Phase 5 (OLD): UI/UX Polish & Professional Design - COMPLETED

### 5.1 Global Design System
- [x] Fix icon sizing issues (currently too large)
- [x] Implement consistent color palette
- [x] Add proper typography scale
- [x] Create design token system
- [x] Ensure proper contrast ratios for accessibility

### 5.2 Navigation & Layout
- [x] Improve header navigation design
- [x] Add breadcrumbs for better navigation (moved to Phase 5)
- [x] Implement proper sidebar navigation (moved to Phase 5)
- [x] Add footer with branding
- [x] Ensure responsive navigation on mobile

### 5.3 Dashboard Improvements
- [x] Redesign metrics cards with better visuals
- [x] Add charts and graphs for data visualization (moved to Phase 5)
- [x] Improve loading states and animations
- [x] Add status indicators and badges
- [x] Implement proper spacing and layout

### 5.4 Settings Page Enhancement
- [x] Improve form layout and styling
- [x] Add form validation feedback
- [x] Better connection status indicators
- [x] Add help tooltips and documentation links
- [x] Implement dark mode toggle

### 5.5 Component Library
- [x] Create reusable button components
- [x] Build consistent card components
- [x] Add status badges and indicators
- [x] Implement modal and dialog components
- [x] Create loading spinner components

### 5.6 Responsive Design
- [x] Fix mobile layout issues (will verify in Phase 5)
- [x] Optimize tablet view
- [x] Ensure proper touch interactions
- [x] Test on different screen sizes
- [x] Add responsive breakpoints

### 5.7 Performance & Accessibility
- [x] Optimize bundle size and loading
- [x] Add ARIA labels and screen reader support (will enhance in Phase 5)
- [x] Implement keyboard navigation (will enhance in Phase 5)
- [x] Add focus management
- [x] Test with accessibility tools

### 5.8 Branding & Polish
- [x] Add LiveKit Dashboard branding
- [x] Create professional color scheme
- [x] Add icons and illustrations
- [x] Implement consistent spacing system
- [x] Add micro-interactions and animations

---

## Phase 6: Real-time Updates

### 5.1 Polling Configuration
- [ ] Configure React Query refetch intervals for rooms
- [ ] Configure React Query refetch intervals for participants
- [ ] Configure React Query refetch intervals for agents
- [ ] Add ability to pause/resume polling
- [ ] Add manual refresh functionality
- [ ] Test polling starts correctly
- [ ] Test polling stops when component unmounts

### 5.2 Real-time Indicators
- [ ] Add "Live" indicator to dashboard
- [ ] Add last updated timestamp
- [ ] Add auto-refresh countdown timer
- [ ] Add loading spinner during refresh
- [ ] Show connection status
- [ ] Test indicators update correctly

### 5.3 Optimistic Updates
- [ ] Implement optimistic UI updates for quick feedback
- [ ] Handle race conditions in data updates
- [ ] Add conflict resolution strategy
- [ ] Test update scenarios

### 5.4 Connection State Management
- [ ] Create connection state store (Zustand)
- [ ] Track online/offline status
- [ ] Track API health status
- [ ] Add reconnection logic
- [ ] Show warnings for stale data
- [ ] Test connection state changes

---

## Phase 6: Navigation & Routing

### 6.1 Router Setup
- [ ] Configure React Router in App.tsx
- [ ] Define routes (/, /settings, /rooms/:id)
- [ ] Create Layout component with navigation
- [ ] Add 404 Not Found page
- [ ] Test navigation between pages

### 6.2 Navigation Component
- [ ] Create NavigationBar component
- [ ] Add links to Dashboard, Settings
- [ ] Add active route highlighting
- [ ] Add responsive mobile menu
- [ ] Style navigation bar
- [ ] Test navigation interactions

### 6.3 Protected Routes
- [ ] Create ProtectedRoute component
- [ ] Check if configuration exists
- [ ] Redirect to Settings if not configured
- [ ] Test route protection
- [ ] Test redirect flow

---

## Phase 7: Error Handling & UX Polish

### 7.1 Error Boundaries
- [ ] Create ErrorBoundary component
- [ ] Wrap app in ErrorBoundary
- [ ] Create error fallback UI
- [ ] Add error reporting (console/service)
- [ ] Test error boundary catches errors

### 7.2 Loading States
- [ ] Create LoadingSpinner component
- [ ] Create SkeletonLoader components
- [ ] Add loading states to all data fetching
- [ ] Add transition animations
- [ ] Test loading states appear correctly

### 7.3 Empty States
- [ ] Create EmptyState component
- [ ] Add empty state for no rooms
- [ ] Add empty state for no participants
- [ ] Add empty state for no agents
- [ ] Add helpful messages and actions
- [ ] Test empty states display correctly

### 7.4 Error Messages
- [ ] Create ErrorMessage component
- [ ] Add user-friendly error messages
- [ ] Add retry buttons for failed requests
- [ ] Show specific errors (auth, network, etc.)
- [ ] Test error messages display correctly

### 7.5 Responsive Design
- [ ] Test dashboard on mobile (320px - 768px)
- [ ] Test dashboard on tablet (768px - 1024px)
- [ ] Test dashboard on desktop (1024px+)
- [ ] Fix any layout issues
- [ ] Verify touch interactions work on mobile

### 7.6 Accessibility
- [ ] Add ARIA labels to interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Test with screen reader
- [ ] Add focus indicators
- [ ] Check color contrast ratios
- [ ] Test with accessibility tools

---

## Phase 8: Production-Grade Testing

### 8.0 Testing Infrastructure Setup

#### 8.0.1 Frontend Testing Setup
- [x] Install Vitest as test runner (`npm install -D vitest`)
- [x] Install React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`)
- [x] Install testing utilities (`@testing-library/react-hooks`, `happy-dom` or `jsdom`)
- [x] Install MSW for API mocking (`msw`)
- [x] Create `vitest.config.ts` in frontend directory
- [x] Create `setupTests.ts` for global test configuration
- [x] Create `__mocks__` directory for mock implementations
- [x] Create `__fixtures__` directory for test data
- [x] Create `test-utils.tsx` with custom render function and providers
- [x] Add test scripts to frontend/package.json (`test`, `test:watch`, `test:coverage`)
- [x] Configure coverage thresholds (80% minimum)
- [x] Test that Vitest runs successfully

#### 8.0.2 Backend Testing Setup
- [x] Install Vitest as test runner (`npm install -D vitest`)
- [x] Install Supertest for HTTP testing (`supertest`, `@types/supertest`)
- [x] Install testing utilities (`@vitest/coverage-v8` for coverage)
- [x] Create `vitest.config.ts` in backend directory
- [x] Create `setupTests.ts` for global test configuration
- [x] Create `__mocks__` directory for mocking LiveKit SDK
- [x] Create `__fixtures__` directory for test data (rooms, participants, agents)
- [x] Create test utilities for Express app instance
- [x] Add test scripts to backend/package.json (`test`, `test:watch`, `test:coverage`)
- [x] Configure coverage thresholds (80% minimum)
- [x] Test that Vitest runs successfully

#### 8.0.3 Test Data Fixtures
- [x] Create room fixtures (`roomFixtures.ts`)
  - activeRoom, closedRoom, roomWithParticipants, emptyRoom
- [x] Create participant fixtures (`participantFixtures.ts`)
  - activeParticipant, disconnectedParticipant, publisherParticipant, subscriberParticipant
- [ ] Create agent fixtures (`agentFixtures.ts`)
  - transcriptionAgent, chatAgent, customAgent
- [x] Create config fixtures (`configFixtures.ts`)
  - validConfig, invalidConfig, missingFieldsConfig
- [ ] Create API response fixtures (`apiResponseFixtures.ts`)
- [x] Export all fixtures from `__fixtures__/index.ts`

### 8.1 Frontend Unit Tests - Domain Layer

#### 8.1.1 Domain Entities Tests
- [ ] Test Room entity (`Room.test.ts`)
  - Test Room interface structure
  - Test RoomState enum values
  - Test Room type guards (if any)
  - Test required vs optional properties
- [ ] Test Participant entity (`Participant.test.ts`)
  - Test Participant interface structure
  - Test ParticipantState enum (JOINING, JOINED, ACTIVE, DISCONNECTED)
  - Test ConnectionQuality enum
  - Test Participant type guards (if any)
- [ ] Test Agent entity (`Agent.test.ts`)
  - Test Agent interface structure
  - Test AgentType enum (VOICE, CHAT, TRANSCRIPTION, CUSTOM)
  - Test AgentState enum
  - Test Agent metadata structure
- [ ] Run domain tests and verify 100% coverage

### 8.2 Frontend Unit Tests - Core Layer (Use Cases)

#### 8.2.1 GetRooms Use Case Tests
- [x] Create `GetRooms.test.ts` with comprehensive test suite
  - **Happy Path**: Test fetching rooms successfully
  - **Validation**: Test with valid livekitService mock
  - **Error Handling**: Test when service throws error
  - **Filtering**: Test hasParticipants filter
  - **Filtering**: Test minParticipants filter
  - **Filtering**: Test namePattern filter
  - **Filtering**: Test combined filters
  - **Edge Cases**: Test empty rooms array
  - **Edge Cases**: Test null/undefined handling
- [x] Verify GetRooms test coverage is 100% (33 tests passing)

#### 8.2.2 GetParticipants Use Case Tests
- [ ] Create `GetParticipants.test.ts` with comprehensive test suite
  - **Happy Path**: Test fetching participants successfully
  - **Validation**: Test with valid roomName and service
  - **Error Handling**: Test when service throws error
  - **Error Handling**: Test with invalid roomName
  - **Filtering**: Test isPublisher filter
  - **Filtering**: Test state filter
  - **Filtering**: Test hasTracks filter
  - **Filtering**: Test combined filters
  - **Edge Cases**: Test empty participants array
  - **Edge Cases**: Test room not found scenario
- [ ] Verify GetParticipants test coverage is 100%

#### 8.2.3 ValidateConnection Use Case Tests
- [x] Create `ValidateConnection.test.ts` with comprehensive test suite
  - **Happy Path**: Test successful connection validation
  - **Validation**: Test with valid config
  - **Error Handling**: Test with invalid credentials (401)
  - **Error Handling**: Test with network error
  - **Error Handling**: Test with timeout error
  - **Error Handling**: Test with invalid server URL
  - **Error Messages**: Test user-friendly error transformations
  - **Edge Cases**: Test with WebSocket URL format
  - **Edge Cases**: Test with HTTP URL format
  - **Edge Cases**: Test with missing protocol
- [x] Verify ValidateConnection test coverage is 100% (15 tests passing)

### 8.3 Frontend Unit Tests - Infrastructure Layer

#### 8.3.1 LocalStorageConfig Tests
- [x] Create `LocalStorageConfig.test.ts` with comprehensive test suite
  - **Happy Path**: Test saveConfig saves to localStorage
  - **Happy Path**: Test loadConfig retrieves from localStorage
  - **Happy Path**: Test clearConfig removes from localStorage
  - **Happy Path**: Test hasConfig returns true when config exists
  - **Validation**: Test saveConfig validates before saving
  - **Validation**: Test saveConfig rejects invalid config
  - **Error Handling**: Test loadConfig handles corrupted data
  - **Error Handling**: Test loadConfig handles missing data
  - **Security**: Test that secret is redacted in logs
  - **Edge Cases**: Test with empty config
  - **Edge Cases**: Test with partial config
  - **Edge Cases**: Test localStorage quota exceeded
- [x] Mock localStorage using Vitest global mocks
- [x] Test localStorage.setItem, getItem, removeItem calls
- [x] Verify LocalStorageConfig test coverage is 100% (37 tests passing)

#### 8.3.2 ApiClient Tests
- [ ] Create `ApiClient.test.ts` with comprehensive test suite
  - **Initialization**: Test initialize method sets config
  - **Initialization**: Test methods throw before initialization
  - **Happy Path**: Test validateConnection success
  - **Happy Path**: Test listRooms returns rooms array
  - **Happy Path**: Test getRoomDetails returns room
  - **Happy Path**: Test listParticipants returns participants
  - **Happy Path**: Test getAgents returns agents
  - **Happy Path**: Test generateRoomToken returns token
  - **Headers**: Test X-LiveKit-Host header injection
  - **Headers**: Test X-LiveKit-Key header injection
  - **Headers**: Test X-LiveKit-Secret header injection
  - **URL Encoding**: Test roomName with spaces
  - **URL Encoding**: Test roomName with special characters
  - **Error Handling**: Test 400 Bad Request
  - **Error Handling**: Test 401 Unauthorized
  - **Error Handling**: Test 404 Not Found
  - **Error Handling**: Test 500 Internal Server Error
  - **Error Handling**: Test network error
  - **Error Handling**: Test timeout error
  - **Edge Cases**: Test empty response
  - **Edge Cases**: Test malformed JSON response
- [ ] Use MSW to mock HTTP requests
- [ ] Test fetch calls with correct URLs and headers
- [ ] Verify ApiClient test coverage is 100%

### 8.4 Frontend Integration Tests - Presentation Layer

#### 8.4.1 ApiClientProvider Tests
- [ ] Create `ApiClientProvider.test.tsx` with integration tests
  - **Initialization**: Test provider loads config on mount
  - **Initialization**: Test apiClient.initialize called with config
  - **Initialization**: Test isInitialized flag set correctly
  - **Context**: Test useApiClient hook returns apiClient
  - **Context**: Test useApiClient hook returns isInitialized
  - **Error Handling**: Test with missing config
  - **Error Handling**: Test with corrupted config
  - **Edge Cases**: Test with invalid config
  - **Integration**: Test full initialization flow
- [ ] Use React Testing Library to test provider
- [ ] Mock LocalStorageConfig
- [ ] Verify ApiClientProvider test coverage is 90%+

#### 8.4.2 useRooms Hook Tests
- [ ] Create `useRooms.test.ts` with integration tests
  - **Happy Path**: Test hook returns rooms data
  - **Happy Path**: Test hook refetches on interval
  - **Query State**: Test loading state
  - **Query State**: Test error state
  - **Query State**: Test success state
  - **Conditional Query**: Test query disabled when config incomplete
  - **Conditional Query**: Test query disabled when not initialized
  - **Conditional Query**: Test query enabled when ready
  - **Retry Logic**: Test no retry on 4xx errors
  - **Retry Logic**: Test retry on 5xx errors
  - **Retry Logic**: Test exponential backoff
  - **Cache**: Test staleTime configuration
  - **Cache**: Test gcTime configuration
  - **Refetch**: Test refetchOnWindowFocus
  - **Edge Cases**: Test empty rooms array
  - **Error Handling**: Test network error handling
- [ ] Use @testing-library/react-hooks
- [ ] Create QueryClient wrapper for tests
- [ ] Mock ApiClient
- [ ] Verify useRooms test coverage is 90%+

#### 8.4.3 useParticipants Hook Tests
- [ ] Create `useParticipants.test.ts` with integration tests
  - **Happy Path**: Test hook returns participants for room
  - **Query State**: Test loading state
  - **Query State**: Test error state
  - **Query State**: Test success state
  - **Conditional Query**: Test query disabled without roomName
  - **Conditional Query**: Test query disabled when config incomplete
  - **Refetch**: Test refetch interval (30 seconds)
  - **Cache**: Test per-room cache keys
  - **Error Handling**: Test room not found error
  - **Edge Cases**: Test empty participants array
- [ ] Use @testing-library/react-hooks
- [ ] Mock ApiClient
- [ ] Verify useParticipants test coverage is 90%+

#### 8.4.4 useSettings Hook Tests
- [ ] Create `useSettings.test.ts` with integration tests
  - **Happy Path**: Test loadConfig on mount
  - **Happy Path**: Test saveConfig updates localStorage
  - **Happy Path**: Test clearConfig removes config
  - **Happy Path**: Test testConnection validates config
  - **State Management**: Test loading state during save
  - **State Management**: Test loading state during test
  - **State Management**: Test error state
  - **State Management**: Test success state
  - **Validation**: Test config validation before save
  - **Error Handling**: Test save error handling
  - **Error Handling**: Test test connection failure
  - **Edge Cases**: Test save with empty config
- [ ] Mock LocalStorageConfig and ApiClient
- [ ] Test state transitions
- [ ] Verify useSettings test coverage is 90%+

#### 8.4.5 useRoomConnection Hook Tests
- [ ] Create `useRoomConnection.test.ts` with integration tests
  - **Happy Path**: Test connection to room
  - **Happy Path**: Test disconnect from room
  - **Event Handling**: Test TranscriptionReceived event
  - **Event Handling**: Test ParticipantConnected event
  - **Event Handling**: Test ParticipantDisconnected event
  - **State Management**: Test connection state transitions
  - **State Management**: Test transcription state updates
  - **Cleanup**: Test cleanup on unmount
  - **Error Handling**: Test connection failure
  - **Error Handling**: Test invalid token
  - **Edge Cases**: Test reconnection logic
- [ ] Mock LiveKit Room and events
- [ ] Test event listener registration/cleanup
- [ ] Verify useRoomConnection test coverage is 85%+

### 8.5 Backend Unit Tests - Services Layer

#### 8.5.1 LiveKitService Tests
- [ ] Create `livekitService.test.ts` with comprehensive test suite
  - **Initialization**: Test service initialization with config
  - **Happy Path**: Test listRooms returns rooms
  - **Happy Path**: Test getRoomDetails returns room
  - **Happy Path**: Test listParticipants returns participants
  - **Happy Path**: Test getAgents returns agents
  - **Happy Path**: Test generateRoomToken returns JWT
  - **Data Transformation**: Test BigInt to number conversion
  - **Data Transformation**: Test timestamp formatting
  - **Error Handling**: Test SDK error propagation
  - **Error Handling**: Test network error
  - **Error Handling**: Test invalid credentials
  - **Edge Cases**: Test empty rooms list
  - **Edge Cases**: Test room not found
  - **Edge Cases**: Test participant not found
- [ ] Mock livekit-server-sdk (RoomServiceClient, AgentDispatchClient)
- [ ] Test all SDK method calls
- [ ] Verify LiveKitService test coverage is 100%

### 8.6 Backend Unit Tests - Middleware Layer

#### 8.6.1 extractLiveKitConfig Middleware Tests
- [x] Create `extractLiveKitConfig.test.ts` with comprehensive test suite
  - **Happy Path**: Test extracts headers correctly
  - **Happy Path**: Test attaches config to req.livekitConfig
  - **WebSocket URL**: Test converts ws:// to http://
  - **WebSocket URL**: Test converts wss:// to https://
  - **WebSocket URL**: Test preserves http:// and https://
  - **Fallback**: Test falls through when headers missing
  - **Validation**: Test with valid headers
  - **Edge Cases**: Test with partial headers
  - **Edge Cases**: Test with malformed URL
  - **Security**: Test header sanitization
- [x] Mock Express request and response objects
- [x] Test next() function calls
- [x] Verify extractLiveKitConfig test coverage is 100% (29 tests passing)

#### 8.6.2 validateConfig Middleware Tests
- [ ] Create `validateConfig.test.ts` with comprehensive test suite
  - **Happy Path**: Test validates correct config
  - **Validation**: Test rejects missing serverUrl
  - **Validation**: Test rejects missing apiKey
  - **Validation**: Test rejects missing apiSecret
  - **Validation**: Test rejects invalid URL format
  - **Error Response**: Test returns 400 on validation failure
  - **Error Response**: Test returns correct error message
  - **Edge Cases**: Test with empty strings
  - **Edge Cases**: Test with null values
  - **Edge Cases**: Test with undefined values
- [ ] Mock Express request and response
- [ ] Test error responses
- [ ] Verify validateConfig test coverage is 100%

#### 8.6.3 errorHandler Middleware Tests
- [ ] Create `errorHandler.test.ts` with comprehensive test suite
  - **Happy Path**: Test formats error response
  - **Status Codes**: Test 400 Bad Request
  - **Status Codes**: Test 401 Unauthorized
  - **Status Codes**: Test 404 Not Found
  - **Status Codes**: Test 500 Internal Server Error
  - **Error Messages**: Test error message extraction
  - **Development Mode**: Test stack trace in development
  - **Production Mode**: Test no stack trace in production
  - **Edge Cases**: Test with non-Error objects
  - **Edge Cases**: Test with string errors
  - **Edge Cases**: Test with null/undefined
- [ ] Mock Express error, request, response, next
- [ ] Test response.status and response.json calls
- [ ] Verify errorHandler test coverage is 100%

#### 8.6.4 rateLimit Middleware Tests
- [ ] Create `rateLimit.test.ts` with comprehensive test suite
  - **Happy Path**: Test allows requests under limit
  - **Rate Limiting**: Test blocks requests over limit (1000/min)
  - **Rate Limiting**: Test per-IP tracking
  - **Rate Limiting**: Test window reset after 1 minute
  - **Response**: Test returns 429 when limit exceeded
  - **Response**: Test returns correct error message
  - **Edge Cases**: Test with multiple IPs
  - **Edge Cases**: Test with missing IP
  - **Performance**: Test doesn't leak memory
- [ ] Mock Express request and response
- [ ] Use fake timers to test window reset
- [ ] Verify rateLimit test coverage is 100%

### 8.7 Backend Integration Tests - API Endpoints

#### 8.7.1 Config Validation Endpoint Tests
- [ ] Create `api.config.test.ts` with integration tests
  - **Happy Path**: Test POST /api/config/validate with valid config
  - **Response**: Test returns success status
  - **Response**: Test returns validation result
  - **Error Handling**: Test with invalid credentials
  - **Error Handling**: Test with network error
  - **Error Handling**: Test with malformed request body
  - **Validation**: Test missing serverUrl
  - **Validation**: Test missing apiKey
  - **Validation**: Test missing apiSecret
  - **Edge Cases**: Test with WebSocket URL
  - **Edge Cases**: Test with HTTP URL
- [ ] Use Supertest for HTTP testing
- [ ] Mock LiveKitService
- [ ] Verify endpoint test coverage is 100%

#### 8.7.2 Rooms Endpoints Tests
- [ ] Create `api.rooms.test.ts` with integration tests
  - **Happy Path**: Test GET /api/rooms returns rooms
  - **Happy Path**: Test GET /api/rooms/:roomName returns room details
  - **Headers**: Test with valid LiveKit headers
  - **Headers**: Test with missing headers (fallback to env)
  - **URL Encoding**: Test roomName with spaces
  - **URL Encoding**: Test roomName with special characters
  - **Error Handling**: Test room not found (404)
  - **Error Handling**: Test invalid credentials (401)
  - **Error Handling**: Test server error (500)
  - **Response Format**: Test response structure
  - **Edge Cases**: Test empty rooms list
- [ ] Use Supertest for HTTP testing
- [ ] Mock LiveKitService
- [ ] Test middleware chain execution
- [ ] Verify endpoint test coverage is 100%

#### 8.7.3 Participants Endpoints Tests
- [ ] Create `api.participants.test.ts` with integration tests
  - **Happy Path**: Test GET /api/rooms/:roomName/participants
  - **Response**: Test returns participants array
  - **Error Handling**: Test room not found
  - **Error Handling**: Test invalid roomName
  - **URL Encoding**: Test roomName encoding
  - **Edge Cases**: Test empty participants list
  - **Edge Cases**: Test room with single participant
- [ ] Use Supertest for HTTP testing
- [ ] Mock LiveKitService
- [ ] Verify endpoint test coverage is 100%

#### 8.7.4 Agents Endpoints Tests
- [ ] Create `api.agents.test.ts` with integration tests
  - **Happy Path**: Test GET /api/rooms/:roomName/agents
  - **Response**: Test returns agents array
  - **Error Handling**: Test room not found
  - **Error Handling**: Test no agents in room
  - **Edge Cases**: Test room with multiple agents
  - **Edge Cases**: Test agent types (VOICE, CHAT, TRANSCRIPTION)
- [ ] Use Supertest for HTTP testing
- [ ] Mock LiveKitService
- [ ] Verify endpoint test coverage is 100%

#### 8.7.5 Token Generation Endpoint Tests
- [ ] Create `api.token.test.ts` with integration tests
  - **Happy Path**: Test POST /api/rooms/:roomName/token
  - **Response**: Test returns valid JWT token
  - **Token Validation**: Test token contains correct claims
  - **Token Validation**: Test token signature is valid
  - **Error Handling**: Test with invalid request body
  - **Error Handling**: Test with missing required fields
  - **Security**: Test token expiration time
- [ ] Use Supertest for HTTP testing
- [ ] Mock LiveKitService
- [ ] Decode and verify JWT structure
- [ ] Verify endpoint test coverage is 100%

### 8.8 Backend Integration Tests - Controllers

#### 8.8.1 roomsController Tests
- [ ] Create `roomsController.test.ts` with integration tests
  - Test listRooms controller logic
  - Test getRoomDetails controller logic
  - Test error handling in controller
  - Test request validation
  - Test response formatting
- [ ] Mock LiveKitService
- [ ] Mock Express request/response
- [ ] Verify controller test coverage is 95%+

#### 8.8.2 participantsController Tests
- [ ] Create `participantsController.test.ts` with integration tests
  - Test listParticipants controller logic
  - Test error handling
  - Test request validation
  - Test response formatting
- [ ] Mock LiveKitService
- [ ] Verify controller test coverage is 95%+

#### 8.8.3 agentsController Tests
- [ ] Create `agentsController.test.ts` with integration tests
  - Test listAgents controller logic
  - Test error handling
  - Test response formatting
- [ ] Mock LiveKitService
- [ ] Verify controller test coverage is 95%+

### 8.9 Test Coverage & Quality

#### 8.9.1 Frontend Coverage Analysis
- [ ] Run frontend tests with coverage (`npm run test:coverage`)
- [ ] Verify overall coverage is ≥80%
- [ ] Verify domain layer coverage is 100%
- [ ] Verify use cases coverage is 100%
- [ ] Verify infrastructure coverage is ≥90%
- [ ] Verify hooks coverage is ≥85%
- [ ] Generate HTML coverage report
- [ ] Review uncovered lines and add tests
- [ ] Document any intentionally uncovered code

#### 8.9.2 Backend Coverage Analysis
- [ ] Run backend tests with coverage (`npm run test:coverage`)
- [ ] Verify overall coverage is ≥80%
- [ ] Verify services coverage is 100%
- [ ] Verify middleware coverage is 100%
- [ ] Verify controllers coverage is ≥95%
- [ ] Verify routes coverage is 100%
- [ ] Generate HTML coverage report
- [ ] Review uncovered lines and add tests
- [ ] Document any intentionally uncovered code

#### 8.9.3 Test Quality Review
- [ ] Review all tests follow AAA pattern (Arrange-Act-Assert)
- [ ] Verify all tests have clear, descriptive names
- [ ] Ensure no flaky tests (run tests 10 times)
- [ ] Verify no test interdependencies
- [ ] Check test execution speed (should be fast)
- [ ] Ensure proper cleanup in all tests
- [ ] Review mock implementations for accuracy
- [ ] Verify edge cases are covered
- [ ] Check error scenarios are tested

#### 8.9.4 CI Integration
- [ ] Add test script to root package.json
- [ ] Create GitHub Actions workflow for tests
- [ ] Configure workflow to run on pull requests
- [ ] Configure workflow to run on push to main
- [ ] Add coverage reporting to CI
- [ ] Add test status badge to README
- [ ] Configure CI to fail on coverage below threshold
- [ ] Test CI pipeline with failing test
- [ ] Test CI pipeline with passing tests

### 8.10 E2E Tests (Optional but Recommended)

#### 8.10.1 E2E Testing Setup
- [ ] Install Playwright (`npm install -D @playwright/test`)
- [ ] Create `playwright.config.ts`
- [ ] Create `e2e` directory for E2E tests
- [ ] Configure test browsers (Chromium, Firefox, WebKit)
- [ ] Set up test data and fixtures
- [ ] Create helper functions for common actions
- [ ] Add E2E test scripts to package.json

#### 8.10.2 E2E User Flows
- [ ] Test complete onboarding flow
  - Open app → redirected to settings → enter config → save → redirect to dashboard
- [ ] Test dashboard viewing flow
  - Open dashboard → see metrics → see rooms → see real-time updates
- [ ] Test settings update flow
  - Change config → test connection → save → verify new config used
- [ ] Test error recovery flow
  - Enter invalid config → see error → correct config → see success
- [ ] Test navigation flow
  - Navigate between Dashboard, Sessions, Settings
- [ ] Test real-time updates flow
  - Load dashboard → wait for auto-refresh → verify new data

#### 8.10.3 E2E Cross-browser Testing
- [ ] Run all E2E tests on Chromium
- [ ] Run all E2E tests on Firefox
- [ ] Run all E2E tests on WebKit/Safari
- [ ] Fix any browser-specific issues
- [ ] Verify consistent behavior across browsers

#### 8.10.4 E2E Performance Testing
- [ ] Test app loads in under 3 seconds
- [ ] Test API responses are under 1 second
- [ ] Test real-time updates don't cause lag
- [ ] Test with throttled network (3G)
- [ ] Verify no memory leaks during long sessions

---

## Phase 9: Documentation

### 9.1 Code Documentation
- [ ] Add JSDoc comments to all public methods
- [ ] Add inline comments for complex logic
- [ ] Document all interfaces and types
- [ ] Create ARCHITECTURE.md explaining design decisions

### 9.2 User Documentation
- [ ] Update README.md with features and screenshots
- [ ] Create SETUP.md with installation instructions
- [ ] Create DEPLOYMENT.md with deployment guide
- [ ] Add troubleshooting section
- [ ] Create FAQ section

### 9.3 Developer Documentation
- [ ] Create CONTRIBUTING.md with contribution guidelines
- [ ] Add code style guide
- [ ] Document project structure
- [ ] Add examples for common tasks
- [ ] Create pull request template
- [ ] Create issue templates

### 9.4 API Documentation
- [ ] Document all backend API endpoints
- [ ] Add request/response examples
- [ ] Document error codes
- [ ] Create Postman/Thunder Client collection

---

## Phase 10: Open Source Preparation

### 10.1 Repository Setup
- [ ] Add LICENSE file (MIT)
- [ ] Add CODE_OF_CONDUCT.md
- [ ] Add SECURITY.md
- [ ] Add CHANGELOG.md
- [ ] Create .github directory

### 10.2 CI/CD Setup
- [ ] Create GitHub Actions workflow for frontend tests
- [ ] Create GitHub Actions workflow for backend tests
- [ ] Add linting checks to CI
- [ ] Add build checks to CI
- [ ] Test CI pipeline

### 10.3 Release Preparation
- [ ] Create demo screenshots/GIFs
- [ ] Create project logo (optional)
- [ ] Set up semantic versioning
- [ ] Create first release (v1.0.0)
- [ ] Tag release in git

### 10.4 Community Setup
- [ ] Enable GitHub Discussions
- [ ] Create issue labels
- [ ] Create project board
- [ ] Pin important issues
- [ ] Prepare announcement post

---

## Phase 11: Final Testing & Launch

### 11.1 Manual Testing
- [ ] Test complete flow with real LiveKit server
- [ ] Test with multiple rooms and participants
- [ ] Test error scenarios (invalid credentials, network errors)
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on different devices (mobile, tablet, desktop)

### 11.2 Performance Testing
- [ ] Check bundle size (frontend)
- [ ] Optimize large dependencies
- [ ] Test with slow network (throttling)
- [ ] Check memory usage
- [ ] Verify no memory leaks

### 11.3 Security Review
- [ ] Verify no credentials exposed in frontend
- [ ] Check CORS configuration
- [ ] Verify input validation on backend
- [ ] Check for XSS vulnerabilities
- [ ] Review dependencies for vulnerabilities

### 11.4 Launch
- [ ] Push to GitHub
- [ ] Publish first release
- [ ] Share on social media
- [ ] Post on relevant communities (Reddit, HN, etc.)
- [ ] Monitor issues and feedback

---

## Phase 12: Real-time Transcription Feature

> **Reference**: See TRANSCRIPTION_RESEARCH.md for detailed research and implementation approaches
> **Goal**: Display real-time agent and user transcriptions in the dashboard (like LiveKit Cloud Dashboard)

### 12.1 Phase 1 - Basic Real-time Display (No Storage)

**Effort**: Low (2-3 hours) | **Priority**: Medium | **Value**: Medium

- [ ] Add livekit-client SDK to frontend dependencies
- [ ] Create `useTranscription` hook (`frontend/src/presentation/hooks/useTranscription.ts`)
  - Subscribe to RoomEvent.TranscriptionReceived
  - Handle interim and final transcription segments
  - Track transcriptions by participant
- [ ] Create `TranscriptionPanel` component (`frontend/src/presentation/components/transcription/TranscriptionPanel.tsx`)
  - Display transcriptions in real-time during active sessions
  - Show participant identity and timestamp
  - Distinguish between interim and final transcriptions
  - Auto-scroll to latest transcription
- [ ] Create `TranscriptionSegment` component for individual transcription entries
- [ ] Add transcription panel to session details view or as sidebar
- [ ] Style components to match dark theme
- [ ] Test with live room that has transcription enabled
- [ ] Test interim vs final transcription updates
- [ ] Add empty state when no transcriptions available
- [ ] Add loading state while connecting to room

**Note**: This phase provides real-time visibility but transcriptions disappear when session ends. No historical data.

### 12.2 Phase 2 - Backend Storage & Historical Transcriptions

**Effort**: Medium (5-8 hours) | **Priority**: High | **Value**: High

#### 12.2.1 Database Schema
- [ ] Add transcriptions table migration to database
  - Columns: id, room_sid, room_name, participant_id, track_id, segment_id, text, is_final, is_agent, timestamp, created_at
  - Add indexes: room_sid, room_name, participant_id, timestamp
- [ ] Run database migration
- [ ] Test database schema creation

#### 12.2.2 Backend API Implementation
- [ ] Create transcription model/type (`backend/src/types/transcription.ts`)
- [ ] Create TranscriptionService (`backend/src/services/transcriptionService.ts`)
  - Implement saveTranscription method
  - Implement getTranscriptionsByRoom method
  - Implement getTranscriptionsBySession method
  - Add pagination support
  - Add filtering by participant
- [ ] Create transcriptionController (`backend/src/controllers/transcriptionController.ts`)
  - POST /api/transcriptions - store transcription
  - GET /api/rooms/:roomName/transcriptions - get room transcriptions
  - GET /api/sessions/:sessionId/transcriptions - get session transcriptions
  - Add input validation
- [ ] Add transcription routes to API router
- [ ] Test API endpoints with Postman/Thunder Client

#### 12.2.3 Frontend Storage Integration
- [ ] Update `useTranscription` hook to send transcriptions to backend
  - POST transcription data on TranscriptionReceived event
  - Handle API errors gracefully
  - Implement retry logic for failed saves
- [ ] Create `useTranscriptionHistory` hook for fetching historical data
  - Integrate React Query for caching
  - Add pagination support
  - Add filtering options
- [ ] Update `TranscriptionPanel` to show historical data when viewing past sessions
- [ ] Add loading states for fetching history
- [ ] Add error handling for failed fetches
- [ ] Test end-to-end storage and retrieval flow

#### 12.2.4 UI Enhancements
- [ ] Add transcription history view to Sessions page
- [ ] Create `TranscriptionTimeline` component for chronological view
- [ ] Add participant filter for transcriptions
- [ ] Add search functionality within transcriptions
- [ ] Add "Show only final" toggle
- [ ] Test historical transcription display
- [ ] Test filtering and search functionality

### 12.3 Phase 3 - Advanced Transcription Features

**Effort**: High (10-15 hours) | **Priority**: Low | **Value**: Very High

#### 12.3.1 Export & Download
- [ ] Create `TranscriptionExporter` utility class
  - Implement exportToTXT method
  - Implement exportToJSON method
  - Implement exportToSRT method (with timestamps)
  - Implement exportToVTT method (WebVTT format)
- [ ] Add export buttons to TranscriptionPanel
- [ ] Implement file download functionality
- [ ] Add export format selector dropdown
- [ ] Test all export formats
- [ ] Verify exported file formatting

#### 12.3.2 Search & Analytics
- [ ] Implement full-text search in transcriptions
  - Add search index to database (if needed)
  - Create search API endpoint
  - Add search UI component
- [ ] Create transcription analytics dashboard
  - Calculate total speaking time per participant
  - Identify most active speakers
  - Generate word clouds (optional)
- [ ] Add keyword highlighting in search results
- [ ] Test search performance with large datasets

#### 12.3.3 Agent Integration Metadata
- [ ] Extend transcription model to include agent metadata
  - Agent ID
  - Agent type (STT provider: Deepgram, AssemblyAI, etc.)
  - Confidence score
  - Language detected
- [ ] Update API to store and retrieve metadata
- [ ] Display metadata in transcription UI
- [ ] Add filters by agent type
- [ ] Test metadata display and filtering

#### 12.3.4 Real-time Syncing & Playback
- [ ] Create audio playback component with transcription sync
  - Highlight current transcription segment during playback
  - Click transcription to jump to audio timestamp
- [ ] Integrate with LiveKit Egress recordings (if available)
- [ ] Add play/pause controls
- [ ] Add playback speed controls
- [ ] Test audio-transcription synchronization

#### 12.3.5 Speaker Identification Enhancement
- [ ] Implement speaker diarization display
- [ ] Add participant avatars to transcription segments
- [ ] Color-code transcriptions by speaker
- [ ] Test speaker identification accuracy

#### 12.3.6 Performance Optimization
- [ ] Implement virtual scrolling for long transcription lists
- [ ] Add pagination for historical transcriptions
- [ ] Optimize database queries with proper indexing
- [ ] Add caching layer for frequently accessed transcriptions
- [ ] Test performance with 1000+ transcription segments
- [ ] Optimize bundle size (code splitting if needed)

### 12.4 Phase 4 - WebSocket Proxy Bot (Optional Advanced)

**Effort**: High (8-12 hours) | **Priority**: Low | **Value**: Medium

- [ ] Create background service for transcription capture bot
- [ ] Implement bot participant management
  - Generate bot access tokens
  - Connect bot to rooms automatically
  - Handle bot lifecycle (connect/disconnect)
- [ ] Set up bot as systemd service or Docker container
- [ ] Add bot monitoring and health checks
- [ ] Configure bot to capture all room transcriptions
- [ ] Test bot reliability and reconnection
- [ ] Document bot deployment process

**Note**: This approach ensures transcriptions are captured even when no frontend clients are active. Useful for guaranteed data collection.

---

## Phase 13: Real-Time Updates with Webhooks + SSE

> **Reference**: See REALTIME_IMPLEMENTATION.md for detailed technical guide
> **Goal**: Replace polling with true real-time updates using LiveKit Webhooks + Server-Sent Events (SSE)
> **Approach**: LiveKit Server → Webhooks → Backend → SSE → Frontend

### 13.1 Planning & Design

**Effort**: Low (1-2 hours) | **Priority**: Critical | **Value**: High

- [x] Review LiveKit Webhooks documentation
- [x] Review Server-Sent Events (SSE) specification
- [x] Create detailed implementation plan in REALTIME_IMPLEMENTATION.md
- [x] Define webhook event types to handle (room_started, room_finished, participant_joined, etc.)
- [ ] Design SSE message format and protocol
- [ ] Design error handling and reconnection strategy
- [ ] Create architecture diagram for Webhook → SSE flow
- [ ] Document security considerations (webhook signature verification)
- [ ] Get team/stakeholder approval on approach

### 13.2 Backend - Webhook Handler Implementation

**Effort**: Medium (3-4 hours) | **Priority**: High | **Value**: High

#### 13.2.1 Webhook Infrastructure
- [ ] Create webhook router (`backend/src/routes/webhooks.ts`)
- [ ] Install LiveKit webhook dependencies (`livekit-server-sdk/WebhookReceiver`)
- [ ] Create webhook endpoint POST `/api/webhooks/livekit`
- [ ] Implement webhook signature verification
  - Extract authorization header
  - Use WebhookReceiver to verify signature
  - Reject invalid signatures with 400 response
- [ ] Add webhook event logging (development mode only)
- [ ] Create webhook types/interfaces (`backend/src/types/webhook.ts`)
- [ ] Add webhook route to main API router
- [ ] Test webhook endpoint responds with 200 OK

#### 13.2.2 Webhook Event Processing
- [ ] Implement event type parsing from webhook payload
- [ ] Create event handler for `room_started`
  - Log room creation
  - Prepare broadcast data
- [ ] Create event handler for `room_finished`
  - Log room closure
  - Prepare broadcast data
- [ ] Create event handler for `participant_joined`
  - Log participant join
  - Prepare participant data for broadcast
- [ ] Create event handler for `participant_left`
  - Log participant leave
  - Prepare participant data for broadcast
- [ ] Create event handler for `track_published`
  - Log track publication
  - Prepare track data for broadcast
- [ ] Create event handler for `track_unpublished`
  - Log track unpublication
  - Prepare track data for broadcast
- [ ] Add error handling for unknown event types
- [ ] Test each event handler with mock webhook data

#### 13.2.3 Webhook Testing Setup
- [ ] Create webhook test fixtures (`backend/src/test/__fixtures__/webhookFixtures.ts`)
- [ ] Create mock webhook payloads for each event type
- [ ] Write unit tests for webhook signature verification
- [ ] Write unit tests for each event handler
- [ ] Test webhook endpoint with valid signatures
- [ ] Test webhook endpoint rejects invalid signatures
- [ ] Test webhook endpoint handles malformed payloads

### 13.3 Backend - Server-Sent Events (SSE) Implementation

**Effort**: Medium (4-5 hours) | **Priority**: High | **Value**: High

#### 13.3.1 SSE Infrastructure
- [ ] Create SSE connection manager (`backend/src/services/sseManager.ts`)
  - Implement Set to store active SSE client connections
  - Implement addClient method
  - Implement removeClient method
  - Implement broadcast method to send events to all clients
  - Implement getClientCount method
  - Add connection ID generation (UUID)
- [ ] Create SSE router (`backend/src/routes/sse.ts`)
- [ ] Create SSE endpoint GET `/api/events`
- [ ] Set proper SSE headers:
  - Content-Type: text/event-stream
  - Cache-Control: no-cache
  - Connection: keep-alive
  - X-Accel-Buffering: no (for nginx)
- [ ] Implement client connection handling
  - Add client to active connections
  - Send initial "connected" event
  - Attach client ID to connection
- [ ] Implement client disconnection handling
  - Listen for request 'close' event
  - Remove client from active connections
  - Log disconnection
- [ ] Add SSE route to main API router
- [ ] Test SSE endpoint accepts connections

#### 13.3.2 SSE Message Broadcasting
- [ ] Define SSE message format interface (`backend/src/types/sse.ts`)
  ```typescript
  interface SSEMessage {
    type: string;
    event: string;
    data: any;
    timestamp: number;
  }
  ```
- [ ] Implement broadcastEvent method in SSE manager
  - Format message as SSE protocol (`data: ${JSON.stringify(msg)}\n\n`)
  - Iterate through all connected clients
  - Send message to each client
  - Handle write errors gracefully
- [ ] Integrate webhook events with SSE broadcasting
  - Call broadcast from webhook handler
  - Map webhook events to SSE message types
  - Transform webhook data for frontend consumption
- [ ] Implement heartbeat/keep-alive mechanism
  - Send comment lines every 30 seconds (`: heartbeat\n\n`)
  - Prevent connection timeout
  - Detect dead connections
- [ ] Test broadcast reaches all connected clients
- [ ] Test heartbeat mechanism keeps connections alive

#### 13.3.3 SSE Security & Performance
- [ ] Add authentication middleware to SSE endpoint (optional for v1)
- [ ] Implement connection limit per user/IP
  - Track connections per identifier
  - Reject new connections if limit exceeded (429)
  - Set max connections to 5 per user
- [ ] Implement rate limiting for broadcasts
  - Debounce rapid events (max 10 events/second)
  - Batch events if needed
- [ ] Add memory leak prevention
  - Set maximum client limit (100 connections)
  - Clean up dead connections periodically
  - Monitor memory usage
- [ ] Test SSE under load (simulate 50+ connections)
- [ ] Test SSE with slow clients (don't block others)
- [ ] Test SSE connection cleanup on server restart

#### 13.3.4 SSE Testing
- [ ] Write unit tests for SSE manager
  - Test addClient/removeClient
  - Test broadcast to multiple clients
  - Test message formatting
- [ ] Write integration tests for SSE endpoint
  - Test connection establishment
  - Test receiving events
  - Test disconnection cleanup
- [ ] Create SSE test utilities
  - Helper to simulate SSE client
  - Helper to parse SSE messages
- [ ] Test SSE with concurrent connections
- [ ] Test SSE error scenarios (client disconnect, server error)

### 13.4 Frontend - SSE Client Implementation

**Effort**: Medium (3-4 hours) | **Priority**: High | **Value**: High

#### 13.4.1 SSE Hook Implementation
- [ ] Create `useRealtimeEvents` hook (`frontend/src/presentation/hooks/useRealtimeEvents.ts`)
- [ ] Implement EventSource connection
  - Connect to `/api/events` endpoint
  - Store EventSource instance in ref
  - Handle connection states (connecting, connected, disconnected)
- [ ] Implement connection event handlers
  - onopen: Set isConnected to true
  - onmessage: Parse and process SSE events
  - onerror: Set isConnected to false, attempt reconnect
- [ ] Parse SSE message data (JSON.parse)
- [ ] Add type safety for SSE message structure
- [ ] Implement cleanup on unmount
  - Close EventSource connection
  - Clear any pending reconnection timers
- [ ] Test hook connects to SSE endpoint
- [ ] Test hook handles connection states correctly

#### 13.4.2 React Query Cache Invalidation
- [ ] Get QueryClient instance in useRealtimeEvents hook
- [ ] Implement cache invalidation for `room_started` event
  - Invalidate ['rooms'] query key
  - Trigger immediate refetch
- [ ] Implement cache invalidation for `room_finished` event
  - Invalidate ['rooms'] query key
  - Trigger immediate refetch
- [ ] Implement cache invalidation for `participant_joined` event
  - Invalidate ['rooms', roomName] query key
  - Invalidate ['participants', roomName] query key
  - Trigger immediate refetch
- [ ] Implement cache invalidation for `participant_left` event
  - Invalidate ['rooms', roomName] query key
  - Invalidate ['participants', roomName] query key
  - Trigger immediate refetch
- [ ] Implement cache invalidation for `track_published` event
  - Invalidate ['participants', roomName] query key
  - Trigger immediate refetch
- [ ] Implement cache invalidation for `track_unpublished` event
  - Invalidate ['participants', roomName] query key
  - Trigger immediate refetch
- [ ] Test cache invalidation triggers refetch
- [ ] Test UI updates with new data

#### 13.4.3 Reconnection Logic
- [ ] Implement exponential backoff for reconnection
  - Start with 1 second delay
  - Double delay on each retry (max 30 seconds)
  - Reset delay on successful connection
- [ ] Implement reconnection attempt counter
  - Track number of retries
  - Give up after 10 failed attempts
  - Show permanent error state
- [ ] Add connection state to hook return value
  ```typescript
  {
    isConnected: boolean;
    connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
    lastEvent: Date | null;
  }
  ```
- [ ] Test reconnection after temporary disconnection
- [ ] Test exponential backoff timing
- [ ] Test permanent failure after max retries

#### 13.4.4 SSE Client Testing
- [ ] Write unit tests for useRealtimeEvents hook
  - Test initial connection
  - Test message handling
  - Test disconnection
  - Test reconnection logic
- [ ] Mock EventSource API
- [ ] Test cache invalidation triggers correctly
- [ ] Test cleanup on unmount
- [ ] Test error handling

### 13.5 Frontend - UI Integration

**Effort**: Low (2-3 hours) | **Priority**: Medium | **Value**: High

#### 13.5.1 Connection Status Indicator
- [ ] Update LiveIndicator component to use SSE connection state
- [ ] Show different states:
  - Connected (green pulsing dot + "LIVE")
  - Connecting (yellow pulsing dot + "CONNECTING")
  - Disconnected (gray dot + "DISCONNECTED")
  - Error (red dot + "CONNECTION ERROR")
- [ ] Add tooltip with connection details
  - Last event timestamp
  - Connection quality
  - Event count
- [ ] Add manual reconnect button (on error)
- [ ] Style indicator to match design system
- [ ] Test indicator updates with connection state changes

#### 13.5.2 Dashboard Integration
- [ ] Import and use useRealtimeEvents hook in Dashboard component
- [ ] Remove or disable polling (keep as fallback for now)
- [ ] Show real-time indicator in page header
- [ ] Add optional event notification toast (on new rooms)
- [ ] Test real-time updates appear without page refresh
- [ ] Test UI remains responsive during updates

#### 13.5.3 Fallback to Polling
- [ ] Keep polling as fallback mechanism
- [ ] Detect when SSE is unavailable
  - Connection fails permanently
  - Browser doesn't support EventSource
  - Network conditions prevent SSE
- [ ] Automatically enable polling on SSE failure
- [ ] Show warning message when using polling fallback
- [ ] Add user preference to disable real-time (use polling only)
- [ ] Test fallback mechanism activates correctly
- [ ] Test switching between SSE and polling

### 13.6 LiveKit Webhook Configuration

**Effort**: Low (1 hour) | **Priority**: Critical | **Value**: High

#### 13.6.1 Local Development Setup
- [ ] Install ngrok for local webhook testing (`npm install -g ngrok`)
- [ ] Start ngrok tunnel to backend port 3001
  ```bash
  ngrok http 3001
  ```
- [ ] Get ngrok public URL (https://abc123.ngrok.io)
- [ ] Document ngrok setup in DOCKER.md
- [ ] Test ngrok tunnel is accessible
- [ ] Test backend accessible via ngrok URL

#### 13.6.2 LiveKit Server Configuration
- [ ] For LiveKit Cloud:
  - Go to project settings
  - Navigate to Webhooks section
  - Add webhook URL: `https://your-domain.com/api/webhooks/livekit`
  - Select all relevant events to receive
  - Save configuration
- [ ] For Self-Hosted LiveKit:
  - Edit `livekit.yaml` configuration file
  - Add webhook configuration:
    ```yaml
    webhook:
      urls:
        - https://your-domain.com/api/webhooks/livekit
      api_key: your-livekit-api-key
    ```
  - Restart LiveKit server
- [ ] Test webhook delivery with test event
- [ ] Verify webhook appears in backend logs
- [ ] Test signature verification works

#### 13.6.3 Production Webhook Setup
- [ ] Set up production domain/URL
- [ ] Configure HTTPS/SSL certificate
- [ ] Add webhook URL to LiveKit production configuration
- [ ] Test webhook delivery in production
- [ ] Monitor webhook logs for errors
- [ ] Set up alerting for webhook failures

### 13.7 Integration Testing

**Effort**: Medium (3-4 hours) | **Priority**: High | **Value**: Critical

#### 13.7.1 End-to-End Real-Time Flow Testing
- [ ] Test complete flow: LiveKit event → Webhook → SSE → Frontend
- [ ] Create test room in LiveKit
  - Trigger room_started event
  - Verify webhook received
  - Verify SSE broadcast
  - Verify frontend receives event
  - Verify UI updates with new room
- [ ] Add participant to test room
  - Trigger participant_joined event
  - Verify event flow through system
  - Verify participant count updates in UI
- [ ] Publish track in test room
  - Trigger track_published event
  - Verify event flow
  - Verify publisher count updates
- [ ] Remove participant from test room
  - Trigger participant_left event
  - Verify event flow
  - Verify UI updates
- [ ] Close test room
  - Trigger room_finished event
  - Verify event flow
  - Verify room removed from UI

#### 13.7.2 Multiple Client Testing
- [ ] Open dashboard in 2+ browser tabs
- [ ] Verify all tabs receive SSE events
- [ ] Trigger room event in LiveKit
- [ ] Verify all tabs update simultaneously
- [ ] Close one tab
- [ ] Verify other tabs still receive events
- [ ] Test with 5+ concurrent clients

#### 13.7.3 Network Resilience Testing
- [ ] Test SSE reconnection after network interruption
  - Disconnect network
  - Wait 10 seconds
  - Reconnect network
  - Verify SSE reconnects automatically
  - Verify events resume flowing
- [ ] Test SSE behavior with slow network
  - Throttle network to 3G
  - Verify events still arrive (may be delayed)
  - Verify no connection drops
- [ ] Test webhook retry behavior
  - Simulate backend downtime
  - Verify LiveKit retries webhook delivery
  - Verify events not lost

#### 13.7.4 Error Scenario Testing
- [ ] Test invalid webhook signature
  - Send webhook with bad signature
  - Verify backend rejects with 400
  - Verify error logged
- [ ] Test SSE client limit reached
  - Connect maximum allowed clients
  - Attempt to connect one more
  - Verify connection rejected with 429
- [ ] Test malformed webhook payload
  - Send invalid JSON
  - Verify backend handles gracefully
  - Verify no crash
- [ ] Test frontend handles SSE errors
  - Simulate SSE server error
  - Verify frontend shows error state
  - Verify fallback to polling works

### 13.8 Performance Optimization

**Effort**: Medium (2-3 hours) | **Priority**: Medium | **Value**: Medium

#### 13.8.1 Backend Optimization
- [ ] Implement event batching
  - Batch rapid events within 100ms window
  - Reduce SSE message flood
- [ ] Implement selective event filtering
  - Allow clients to subscribe to specific event types
  - Only send relevant events to each client
- [ ] Optimize broadcast performance
  - Use async iteration for client broadcast
  - Avoid blocking on slow clients
- [ ] Add performance monitoring
  - Track SSE connection count
  - Track event broadcast latency
  - Log performance metrics

#### 13.8.2 Frontend Optimization
- [ ] Debounce rapid cache invalidations
  - Prevent excessive refetches
  - Batch invalidations within 500ms
- [ ] Implement optimistic UI updates
  - Update UI immediately on event
  - Validate with server data
  - Rollback if mismatch
- [ ] Add event deduplication
  - Track recent event IDs
  - Ignore duplicate events
- [ ] Optimize React re-renders
  - Use React.memo for LiveIndicator
  - Use useMemo for event processing

#### 13.8.3 Load Testing
- [ ] Test backend with 100 concurrent SSE connections
- [ ] Test webhook handler with 100 req/sec
- [ ] Measure SSE broadcast latency (should be <50ms)
- [ ] Measure end-to-end latency (webhook → UI update)
  - Target: <200ms for 95th percentile
- [ ] Test memory usage over 24 hours
  - Verify no memory leaks
  - Monitor connection cleanup
- [ ] Document performance benchmarks

### 13.9 Monitoring & Observability

**Effort**: Low (2 hours) | **Priority**: Medium | **Value**: Medium

#### 13.9.1 Logging
- [ ] Add structured logging for webhooks
  - Log event type
  - Log room/participant IDs
  - Log processing time
- [ ] Add structured logging for SSE
  - Log client connections/disconnections
  - Log broadcast events
  - Log errors
- [ ] Configure log levels (debug, info, warn, error)
- [ ] Add log rotation (production)
- [ ] Test logs are useful for debugging

#### 13.9.2 Metrics
- [ ] Add metric: Active SSE connections count
- [ ] Add metric: Webhooks received count
- [ ] Add metric: Webhook processing latency
- [ ] Add metric: SSE broadcast latency
- [ ] Add metric: Event types distribution
- [ ] Expose metrics endpoint (optional)
  - GET `/api/metrics`
  - Return metrics as JSON
  - Secure with authentication

#### 13.9.3 Health Checks
- [ ] Update health endpoint to include SSE status
  - Number of active connections
  - Last webhook received timestamp
  - SSE manager status
- [ ] Add dedicated SSE health check endpoint
  - GET `/api/events/health`
  - Return connection count and status
- [ ] Test health check endpoints

### 13.10 Documentation

**Effort**: Low (2-3 hours) | **Priority**: High | **Value**: High

#### 13.10.1 Technical Documentation
- [ ] Update REALTIME_IMPLEMENTATION.md with implementation details
- [ ] Document SSE message format
- [ ] Document webhook event types handled
- [ ] Document reconnection logic and timing
- [ ] Add architecture diagram
- [ ] Document security considerations
- [ ] Add troubleshooting section

#### 13.10.2 User Documentation
- [ ] Update README.md with real-time feature description
- [ ] Add real-time setup instructions
- [ ] Document LiveKit webhook configuration steps
- [ ] Add FAQ section for real-time issues
- [ ] Create video/GIF showing real-time updates

#### 13.10.3 Developer Documentation
- [ ] Document how to test webhooks locally (ngrok)
- [ ] Document how to add new event handlers
- [ ] Document SSE client hook usage
- [ ] Add code examples for common scenarios
- [ ] Document performance considerations

### 13.11 Deployment & Rollout

**Effort**: Low (1-2 hours) | **Priority**: High | **Value**: Critical

#### 13.11.1 Staging Deployment
- [ ] Deploy backend changes to staging
- [ ] Deploy frontend changes to staging
- [ ] Configure LiveKit staging webhooks
- [ ] Test complete flow in staging
- [ ] Verify no regressions in existing features
- [ ] Test with real staging LiveKit server

#### 13.11.2 Production Rollout Strategy
- [ ] Create feature flag for real-time updates
  - Allow enable/disable without redeployment
  - Default to disabled initially
- [ ] Deploy to production with feature disabled
- [ ] Enable feature for internal testing (10% of users)
- [ ] Monitor metrics and errors
- [ ] Gradually increase rollout (25%, 50%, 100%)
- [ ] Keep polling as fallback during rollout

#### 13.11.3 Rollback Plan
- [ ] Document rollback procedure
  - Disable feature flag
  - Verify polling fallback works
  - Revert deployments if needed
- [ ] Test rollback in staging
- [ ] Prepare rollback communication plan
- [ ] Monitor key metrics during rollout

#### 13.11.4 Post-Deployment Monitoring
- [ ] Monitor SSE connection count
- [ ] Monitor webhook delivery success rate
- [ ] Monitor event processing latency
- [ ] Monitor frontend error rates
- [ ] Set up alerts for anomalies
- [ ] Review logs for issues

### 13.12 Cleanup & Polish

**Effort**: Low (1-2 hours) | **Priority**: Low | **Value**: Medium

#### 13.12.1 Code Cleanup
- [ ] Remove old polling code (if fully replaced)
- [ ] Remove debug logging
- [ ] Clean up commented code
- [ ] Run linter and fix all warnings
- [ ] Optimize imports
- [ ] Add final code comments

#### 13.12.2 Testing Cleanup
- [ ] Ensure all tests pass
- [ ] Achieve >90% code coverage for new code
- [ ] Remove obsolete tests
- [ ] Update test fixtures
- [ ] Document test setup

#### 13.12.3 Final Verification
- [ ] Test all event types work correctly
- [ ] Test on all supported browsers
- [ ] Test on mobile devices
- [ ] Verify performance benchmarks met
- [ ] Verify no memory leaks
- [ ] Get final code review approval

---

## Notes

- Mark each task as completed only after testing confirms it works
- If a task becomes too large, break it down into smaller subtasks
- Add new tasks as needed during implementation
- Update this file as the project evolves
- Each phase should be fully completed before moving to the next
