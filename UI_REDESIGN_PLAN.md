# UI Redesign Plan - LiveKit Dashboard

## Goal
Transform the current UI to match the professional quality of LiveKit Cloud Dashboard while maintaining our self-hosted, open-source identity.

## Design Inspiration
Using LiveKit Cloud Dashboard as reference, focusing on:
- Clean, modern dark theme
- Professional data table layouts
- Metric cards with mini visualizations
- Sidebar navigation pattern
- Real-time indicators and filters
- Professional typography and spacing

## Phase 1: Foundation & Design System

### 1.1 Design Tokens & Theme
**Objective:** Establish consistent design system matching LiveKit Cloud aesthetic

**Tasks:**
- [ ] Implement dark theme as default (matching LiveKit Cloud's black background)
- [ ] Define color palette:
  - Background: `#000000` (pure black)
  - Card background: `#0F0F0F` (very dark gray)
  - Border: `#262626` (subtle borders)
  - Primary: `#3B82F6` (blue for accents)
  - Text primary: `#FFFFFF`
  - Text secondary: `#A3A3A3`
  - Success: `#10B981`
  - Warning: `#F59E0B`
  - Danger: `#EF4444`
- [ ] Define typography scale:
  - Headings: Inter or System font stack
  - Body: 14px base size (matching LiveKit Cloud)
  - Monospace: for IDs and technical data
- [ ] Define spacing system (4px base unit)
- [ ] Define border radius values (sm: 4px, md: 8px, lg: 12px)
- [ ] Update Tailwind config with new design tokens

**Files to modify:**
- `frontend/tailwind.config.js`
- Create `frontend/src/styles/design-tokens.css`

---

### 1.2 Layout Structure
**Objective:** Implement professional layout with sidebar navigation

**Tasks:**
- [ ] Create `AppLayout` component with sidebar + main content area
- [ ] Build `Sidebar` component with navigation items
- [ ] Add sidebar collapse/expand functionality
- [ ] Implement responsive sidebar (drawer on mobile)
- [ ] Create `Header` component with breadcrumbs and user actions
- [ ] Add page transitions and animations

**New components:**
- `frontend/src/presentation/components/layout/AppLayout.tsx`
- `frontend/src/presentation/components/layout/Sidebar.tsx`
- `frontend/src/presentation/components/layout/Header.tsx`
- `frontend/src/presentation/components/layout/PageContainer.tsx`

**Navigation structure:**
```
- Overview (Dashboard)
- Sessions (Rooms with session history)
- Settings
```

---

## Phase 2: Sessions Page (Main Dashboard Replacement)

### 2.1 Sessions Overview Cards
**Objective:** Add metric cards with mini visualizations like LiveKit Cloud

**Tasks:**
- [ ] Create `MetricCard` component with chart capability
- [ ] Implement "Unique participants" card with sparkline chart
- [ ] Implement "Total rooms" card with sparkline chart
- [ ] Add real data to metric cards (from rooms API)
- [ ] Create simple sparkline/area chart component (using existing data or mock trend)
- [ ] Add loading skeletons for metric cards
- [ ] Add hover effects and animations

**New components:**
- `frontend/src/presentation/components/metrics/MetricCard.tsx`
- `frontend/src/presentation/components/metrics/MiniChart.tsx` (simple SVG-based chart)

---

### 2.2 Sessions Data Table
**Objective:** Replace RoomList cards with professional data table matching LiveKit Cloud

**Tasks:**
- [ ] Create reusable `DataTable` component
- [ ] Implement table columns:
  - Session ID (room SID, monospace font)
  - Room name
  - Started at (formatted timestamp)
  - Ended at (formatted timestamp, "—" if active)
  - Duration (calculated from timestamps)
  - Participants (number)
  - Features (badges: Agents, SIP, etc.)
  - Status (badge: ACTIVE/CLOSED)
- [ ] Add column sorting functionality
- [ ] Add row hover states
- [ ] Implement empty state for table
- [ ] Implement loading state (skeleton rows)
- [ ] Add row click to show session details

**New components:**
- `frontend/src/presentation/components/table/DataTable.tsx`
- `frontend/src/presentation/components/table/TableHeader.tsx`
- `frontend/src/presentation/components/table/TableRow.tsx`
- `frontend/src/presentation/components/table/TableCell.tsx`

**Files to modify:**
- `frontend/src/presentation/pages/Dashboard.tsx` (rename to Sessions.tsx)
- Remove `RoomList.tsx` and `RoomCard.tsx` (replace with table)

---

### 2.3 Filters & Controls
**Objective:** Add filtering and real-time controls like LiveKit Cloud

**Tasks:**
- [ ] Create filter bar component with:
  - Time range dropdown (Last hour, Last 24 hours, Last 7 days, Custom)
  - Search/filter input
  - Refresh button
  - Auto-refresh toggle
  - Last updated timestamp
- [ ] Implement time range filtering logic
- [ ] Implement search/filter functionality
- [ ] Add "Filters" button with dropdown for advanced filters
- [ ] Connect filters to React Query

**New components:**
- `frontend/src/presentation/components/filters/FilterBar.tsx`
- `frontend/src/presentation/components/filters/TimeRangeSelect.tsx`
- `frontend/src/presentation/components/filters/SearchInput.tsx`

---

## Phase 3: Real-time Updates & LiveKit SDK Integration

### 3.1 Use Official LiveKit React Components
**Objective:** Leverage @livekit/components-react for consistent UI

**Tasks:**
- [ ] Audit available components from @livekit/components-react
- [ ] Replace custom-built components with official ones where applicable:
  - Audio/Video visualizations
  - Participant lists
  - Connection quality indicators
  - Audio level indicators
- [ ] Customize styling to match our dark theme
- [ ] Document which official components we're using

**Files to review:**
- Check @livekit/components-react documentation
- Update components to use official implementations

---

### 3.2 Real-time Data Updates
**Objective:** Implement WebSocket or polling for live updates without refresh

**Tasks:**
- [ ] Configure React Query with aggressive refetch intervals:
  - `refetchInterval: 5000` (5 seconds for active tab)
  - `refetchOnWindowFocus: true`
  - `refetchOnReconnect: true`
- [ ] Add visual indicator for real-time updates:
  - "Live" badge with pulse animation
  - Last updated timestamp
  - Loading indicator during refetch
- [ ] Implement optimistic updates for better UX
- [ ] Add toast notifications for new rooms/participants
- [ ] (Future) Consider WebSocket connection for true real-time (LiveKit doesn't provide this in SDK)

**Files to modify:**
- `frontend/src/presentation/hooks/useRooms.ts`
- Add `frontend/src/presentation/hooks/useRealtime.ts`
- Add `frontend/src/presentation/components/ui/LiveIndicator.tsx`

---

### 3.3 Session Details View
**Objective:** Add detailed view when clicking on a session/room

**Tasks:**
- [ ] Create session details modal or side panel
- [ ] Show detailed information:
  - Room metadata
  - Participant list with details
  - Agents list
  - Connection timeline
  - Events log (if available)
- [ ] Use LiveKit official components for participant displays
- [ ] Add real-time updates to details view

**New components:**
- `frontend/src/presentation/components/sessions/SessionDetailsModal.tsx`
- `frontend/src/presentation/components/sessions/ParticipantsList.tsx` (using official components)
- `frontend/src/presentation/components/sessions/AgentsList.tsx`

---

## Phase 4: Advanced Features & Polish

### 4.1 Enhanced Status Indicators
**Objective:** Add professional status badges and indicators

**Tasks:**
- [ ] Update `StatusBadge` component to match LiveKit Cloud style
- [ ] Add status variants:
  - ACTIVE (green)
  - CLOSED (gray)
  - ERROR (red)
  - CONNECTING (yellow)
- [ ] Add feature badges:
  - Agents (icon + text)
  - SIP (icon + text)
  - Recording (icon + text)
- [ ] Add connection quality indicators
- [ ] Add participant count badges

**Files to modify:**
- `frontend/src/presentation/components/ui/StatusBadge.tsx`
- Add `frontend/src/presentation/components/ui/FeatureBadge.tsx`

---

### 4.2 Settings Page Redesign
**Objective:** Match Settings UI to new design system

**Tasks:**
- [ ] Redesign Settings page with new dark theme
- [ ] Organize settings into sections with cards
- [ ] Improve form layout and styling
- [ ] Add better validation feedback
- [ ] Add connection status indicator
- [ ] Use new design tokens and components

**Files to modify:**
- `frontend/src/presentation/pages/Settings.tsx`
- `frontend/src/presentation/components/settings/ServerConfigForm.tsx`

---

### 4.3 Loading & Empty States
**Objective:** Professional loading and empty states

**Tasks:**
- [ ] Create skeleton loaders matching table structure
- [ ] Design empty states with illustrations/icons
- [ ] Add micro-animations for state transitions
- [ ] Ensure consistent loading UX across all views

**Files to modify:**
- `frontend/src/presentation/components/ui/LoadingSpinner.tsx`
- Add `frontend/src/presentation/components/ui/TableSkeleton.tsx`
- Add `frontend/src/presentation/components/ui/EmptyState.tsx`

---

### 4.4 Responsive Design
**Objective:** Ensure mobile and tablet experiences are excellent

**Tasks:**
- [ ] Test table on mobile (may need card view fallback)
- [ ] Implement responsive sidebar (drawer on mobile)
- [ ] Optimize metric cards for mobile (stack vertically)
- [ ] Test all breakpoints (mobile, tablet, desktop)
- [ ] Add touch-friendly interactions

---

## Phase 5: Testing & Documentation

### 5.1 Visual Regression Testing
**Tasks:**
- [ ] Take screenshots of all pages before/after redesign
- [ ] Test in Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Verify dark theme contrast ratios (WCAG compliance)

### 5.2 Documentation
**Tasks:**
- [ ] Update README with new screenshots
- [ ] Document design system in Storybook (optional) or markdown
- [ ] Update CLAUDE.md with new component patterns
- [ ] Create UI component documentation

---

## Implementation Strategy

### Priority Order:
1. **Phase 1.1** - Design tokens & theme (foundation)
2. **Phase 1.2** - Layout structure with sidebar
3. **Phase 2.2** - Sessions data table (core feature)
4. **Phase 2.1** - Metric cards
5. **Phase 2.3** - Filters & controls
6. **Phase 3.2** - Real-time updates
7. **Phase 3.3** - Session details view
8. **Phase 3.1** - LiveKit SDK components integration
9. **Phase 4** - Polish and enhancements
10. **Phase 5** - Testing & documentation

### Development Approach:
1. Create each component in isolation
2. Test with mock data first
3. Integrate with real API
4. Add animations and polish
5. Test responsive behavior
6. Update TASKS.md as we complete each item

---

## Key Differences from "Typical Claude Code Generated UI"

To avoid generic Claude-generated aesthetics:

✅ **DO:**
- Use LiveKit Cloud Dashboard as exact reference
- Implement data tables (not cards everywhere)
- Use pure black background (#000000)
- Add micro-animations and transitions
- Use real data visualizations (charts)
- Implement professional typography
- Add subtle hover effects
- Use monospace fonts for technical data (IDs, timestamps)

❌ **DON'T:**
- Use generic card-based layouts for everything
- Use light theme or generic gray backgrounds
- Over-animate or use distracting effects
- Use default Tailwind colors without customization
- Create overly rounded corners (keep it professional)
- Use emoji or playful elements

---

## Success Criteria

The redesign is successful when:
- ✅ UI closely matches LiveKit Cloud Dashboard aesthetic
- ✅ Dark theme with professional color palette
- ✅ Data table for sessions works smoothly
- ✅ Real-time updates work without page refresh
- ✅ Sidebar navigation is functional
- ✅ Metric cards show actual data
- ✅ Mobile responsive design works well
- ✅ Loading and empty states are polished
- ✅ LiveKit official components are integrated
- ✅ Code is maintainable and well-documented

---

## Timeline Estimate

- **Phase 1**: 2-3 hours (foundation)
- **Phase 2**: 4-5 hours (core sessions UI)
- **Phase 3**: 3-4 hours (real-time & details)
- **Phase 4**: 2-3 hours (polish)
- **Phase 5**: 1-2 hours (testing)

**Total**: ~12-17 hours of focused development

---

## Next Steps

1. Review and approve this plan
2. Break down into smaller tasks in TASKS.md
3. Start with Phase 1.1 (design tokens)
4. Build incrementally, testing at each step
5. Commit frequently with descriptive messages
6. Take screenshots for before/after comparison
