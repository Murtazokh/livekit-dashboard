import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TopNavbar } from './TopNavbar';
import { useRealtimeEvents } from '../../hooks/useRealtimeEvents';

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
  headerActions?: React.ReactNode;
  lastUpdated?: Date;
  isRefreshing?: boolean;
}

/**
 * Main application layout with sidebar navigation
 * Matches LiveKit Cloud Dashboard structure
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  pageTitle,
  pageSubtitle,
  headerActions,
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
    <div className="min-h-screen bg-background">
      {/* Top Navbar - Global controls */}
      <TopNavbar
        lastUpdated={lastEvent || lastUpdated}
        isRefreshing={isRefreshing}
        connectionState={connectionState}
        onManualReconnect={manualReconnect}
      />

      {/* Mobile overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 mt-16"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Below top navbar */}
      <div
        className={`
          ${isMobile ? 'fixed z-40' : 'fixed'}
          ${isMobile && !isMobileSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          transition-transform duration-300
          top-16
          h-[calc(100vh-4rem)]
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
          transition-all duration-300
          pt-16
          ${isMobile ? 'ml-0' : isSidebarCollapsed ? 'ml-16' : 'ml-64'}
        `}
      >
        {/* Mobile menu button */}
        {isMobile && (
          <div className="fixed top-20 left-4 z-20">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-md bg-card border border-border shadow-md hover:bg-card-hover transition-colors"
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Header */}
        <Header title={pageTitle} subtitle={pageSubtitle} actions={headerActions} />

        {/* Page content */}
        <main className="min-h-[calc(100vh-73px-4rem)]">{children}</main>
      </div>
    </div>
  );
};
