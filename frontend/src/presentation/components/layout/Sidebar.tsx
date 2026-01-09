import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

/**
 * Sidebar navigation component matching LiveKit Cloud Dashboard style
 */
export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      path: '/sessions',
      label: 'Sessions',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m16.24-3.76l-4.24 4.24m-6-6L2.76 6.24m16.24 12.52l-4.24-4.24m-6 6L2.76 17.76" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full
        bg-card border-r border-border
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        flex flex-col
        z-40
      `}
    >
      {/* Logo / Brand */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31-0.78-6-4.42-6-8V8.3l6-3.11v14.81z" />
            </svg>
            <div>
              <h1 className="text-lg font-semibold">LiveKit</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
        )}
        {!isCollapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            aria-label="Collapse sidebar"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md hover:bg-muted transition-colors mx-auto"
            aria-label="Expand sidebar"
          >
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31-0.78-6-4.42-6-8V8.3l6-3.11v14.81z" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-3 py-2.5 rounded-md
                transition-all duration-200
                ${active
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <span className={active ? 'text-primary-foreground' : ''}>{item.icon}</span>
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User section (optional) */}
      <div className="px-4 py-4 border-t border-border">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">LK</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium">Self-Hosted</p>
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
