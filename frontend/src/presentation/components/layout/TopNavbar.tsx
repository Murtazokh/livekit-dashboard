import React from 'react';
import { Settings, Activity, WifiOff, RefreshCw, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import type { ConnectionState } from '../../../types/sse';

interface TopNavbarProps {
  lastUpdated?: Date;
  isRefreshing?: boolean;
  // Real-time connection props
  connectionState?: ConnectionState;
  onManualReconnect?: () => void;
  // Mobile menu props
  isMobile?: boolean;
  onToggleMobileMenu?: () => void;
}

/**
 * Top navigation bar following SaaS best practices
 * Contains global controls: theme toggle, settings, status indicators
 */
export const TopNavbar: React.FC<TopNavbarProps> = ({
  lastUpdated,
  isRefreshing,
  connectionState = 'disconnected',
  onManualReconnect,
  isMobile = false,
  onToggleMobileMenu,
}) => {
  const formatLastUpdated = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  // Get status display based on connection state
  const getConnectionStatus = () => {
    switch (connectionState) {
      case 'connected':
        return {
          icon: Activity,
          iconColor: 'text-success',
          label: 'LIVE',
          showPulse: true,
        };
      case 'connecting':
        return {
          icon: RefreshCw,
          iconColor: 'text-warning',
          label: 'CONNECTING',
          showPulse: true,
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          iconColor: 'text-muted-foreground',
          label: 'DISCONNECTED',
          showPulse: false,
        };
      case 'error':
        return {
          icon: WifiOff,
          iconColor: 'text-destructive',
          label: 'ERROR',
          showPulse: false,
        };
    }
  };

  const status = getConnectionStatus();
  const StatusIcon = status.icon;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Hamburger Menu (Mobile) */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Menu */}
          {isMobile && onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-card-hover border border-transparent hover:border-border transition-all"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          )}
        </div>

        {/* Right: Global Controls */}
        <div className="flex items-center gap-3">
          {/* Live Status Indicator with SSE Connection State */}
          <div
            className={`flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-md bg-card border border-border ${
              connectionState === 'error' ? 'cursor-pointer hover:bg-card-hover' : ''
            }`}
            onClick={connectionState === 'error' ? onManualReconnect : undefined}
            title={
              connectionState === 'error'
                ? 'Click to retry connection'
                : connectionState === 'connected'
                  ? 'Real-time updates active'
                  : connectionState === 'connecting'
                    ? 'Connecting to server...'
                    : 'Disconnected from server'
            }
          >
            <div className="relative flex items-center">
              <StatusIcon
                className={`h-4 w-4 ${status.iconColor} ${connectionState === 'connecting' ? 'animate-spin' : ''}`}
              />
              {status.showPulse && (
                <span className="absolute inset-0">
                  <span
                    className={`absolute inset-0 rounded-full opacity-75 animate-ping ${
                      connectionState === 'connected' ? 'bg-success' : 'bg-warning'
                    }`}
                  ></span>
                </span>
              )}
            </div>
            {/* Hide status text on mobile, show only on medium screens and up */}
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-mono font-semibold leading-none">{status.label}</span>
              <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                {formatLastUpdated(lastUpdated)}
              </span>
            </div>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Settings Button */}
          <Link
            to="/settings"
            className="flex items-center justify-center h-10 w-10 rounded-md hover:bg-card-hover border border-transparent hover:border-border transition-all"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
        </div>
      </div>
    </header>
  );
};
