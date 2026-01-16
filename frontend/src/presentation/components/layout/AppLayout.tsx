import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useRealtimeEvents } from '../../hooks/useRealtimeEvents';

interface AppLayoutProps {
  children: React.ReactNode;
  lastUpdated?: Date;
  isRefreshing?: boolean;
}

/**
 * Main application layout with sidebar navigation
 * Matches LiveKit Cloud Dashboard structure
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  lastUpdated,
  isRefreshing,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Real-time events via SSE
  const { connectionState, lastEvent, manualReconnect } = useRealtimeEvents();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Full height on desktop */}
      <div
        className={`
          ${isMobile ? 'fixed z-40' : 'fixed'}
          ${isMobile && !isMobileSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          transition-transform duration-300
          top-0
          h-screen
        `}
      >
        <Sidebar
          isCollapsed={!isMobile && isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
      </div>

      {/* Main content area */}
      <div
        className={`
          flex-1
          transition-all duration-300
          ${isMobile ? 'ml-0' : isSidebarCollapsed ? 'ml-16' : 'ml-64'}
        `}
      >
        {/* Top Navbar - Global controls */}
        <TopNavbar
          lastUpdated={lastEvent || lastUpdated}
          isRefreshing={isRefreshing}
          connectionState={connectionState}
          onManualReconnect={manualReconnect}
          isMobile={isMobile}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
};
