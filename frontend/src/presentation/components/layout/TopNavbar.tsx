import React from 'react';
import { Settings, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';

interface TopNavbarProps {
  lastUpdated?: Date;
  isRefreshing?: boolean;
}

/**
 * Top navigation bar following SaaS best practices
 * Contains global controls: theme toggle, settings, status indicators
 */
export const TopNavbar: React.FC<TopNavbarProps> = ({ lastUpdated, isRefreshing }) => {
  const formatLastUpdated = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
              <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31-0.78-6-4.42-6-8V8.3l6-3.11v14.81z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none">LiveKit</h1>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Right: Global Controls */}
        <div className="flex items-center gap-3">
          {/* Live Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border">
            <div className="relative flex items-center">
              <Activity className={`h-4 w-4 ${isRefreshing ? 'text-primary' : 'text-success'}`} />
              {isRefreshing && (
                <span className="absolute inset-0">
                  <span className="absolute inset-0 rounded-full bg-primary opacity-75 animate-ping"></span>
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono font-semibold leading-none">
                {isRefreshing ? 'UPDATING' : 'LIVE'}
              </span>
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
