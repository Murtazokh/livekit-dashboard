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
- [ ] Rename Dashboard.tsx to Sessions.tsx or create new Sessions page
- [ ] Replace RoomList cards with DataTable
- [ ] Add metric cards at top of page
- [ ] Integrate filter bar component
- [ ] Update page layout to match LiveKit Cloud
- [ ] Add page header with title and controls
- [ ] Update routing if page renamed
- [ ] Remove old RoomCard component (if not needed elsewhere)
- [ ] Test entire sessions page flow

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
- [ ] Update `StatusBadge` component to match LiveKit Cloud style
- [ ] Add status variants:
  - ACTIVE (green with dot)
  - CLOSED (gray)
  - ERROR (red)
  - CONNECTING (yellow)
- [ ] Create `FeatureBadge` component for room features
  - Agents badge
  - SIP badge
  - Recording badge
- [ ] Add icons to badges
- [ ] Style badges to match reference design
- [ ] Test badges in table context

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
- [ ] Update Settings page to use new dark theme
- [ ] Reorganize settings into card-based sections
- [ ] Update form styling to match new design
- [ ] Improve validation feedback UI
- [ ] Add connection status indicator
- [ ] Update ServerConfigForm styling
- [ ] Test settings page with new theme

### 5.12 Loading & Empty States Polish
- [ ] Create `TableSkeleton` component matching table structure
- [ ] Update `EmptyState` component with better design
- [ ] Add illustrations or icons to empty states
- [ ] Add micro-animations for state transitions
- [ ] Ensure consistent loading UX across all views
- [ ] Test all loading and empty state scenarios

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

## Phase 8: Testing

### 8.1 Unit Tests - Frontend
- [ ] Test Room domain model
- [ ] Test Participant domain model
- [ ] Test Agent domain model
- [ ] Test ValidateConnection use case
- [ ] Test GetRooms use case
- [ ] Test GetParticipants use case
- [ ] Test GetAgents use case
- [ ] Test LocalStorageConfig
- [ ] Test ApiClient methods
- [ ] Run all tests and verify 80%+ coverage

### 8.2 Unit Tests - Backend
- [ ] Test LiveKitService methods
- [ ] Test roomsController
- [ ] Test participantsController
- [ ] Test agentsController
- [ ] Test middleware functions
- [ ] Run all tests and verify 80%+ coverage

### 8.3 Integration Tests
- [ ] Test Settings page saves configuration
- [ ] Test Dashboard loads rooms correctly
- [ ] Test API client calls backend correctly
- [ ] Test backend calls LiveKit API correctly
- [ ] Test error handling end-to-end
- [ ] Run all integration tests

### 8.4 E2E Tests (Optional)
- [ ] Set up Playwright or Cypress
- [ ] Test complete user flow (configure → view dashboard)
- [ ] Test navigation between pages
- [ ] Test refresh functionality
- [ ] Run E2E tests in CI environment

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

## Notes

- Mark each task as completed only after testing confirms it works
- If a task becomes too large, break it down into smaller subtasks
- Add new tasks as needed during implementation
- Update this file as the project evolves
- Each phase should be fully completed before moving to the next
