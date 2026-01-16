import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Video, Bot, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

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
 * Sidebar navigation component with consistent Lucide icons
 * Focused on navigation only - global controls moved to top navbar
 */
export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Overview',
      icon: <LayoutGrid className="w-5 h-5" strokeWidth={2} />,
    },
    {
      path: '/sessions',
      label: 'Sessions',
      icon: <Video className="w-5 h-5" strokeWidth={2} />,
    },
    {
      path: '/agents',
      label: 'Agent Sessions',
      icon: <Bot className="w-5 h-5" strokeWidth={2} />,
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" strokeWidth={2} />,
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
        h-full
        bg-card border-r border-border
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        flex flex-col
        group/sidebar
      `}
    >
      {/* Brand Section with Collapse Toggle */}
      <div className="flex items-center justify-between px-4 py-4 relative">
        {/* Brand - Hidden when collapsed */}
        {!isCollapsed && (
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
        )}

        {/* Collapse Toggle - Appears on hover */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`
              p-1.5 rounded-md hover:bg-muted transition-all
              opacity-0 group-hover/sidebar:opacity-100
              ${isCollapsed ? 'mx-auto' : 'absolute right-2'}
            `}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
            ) : (
              <ChevronLeft className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
            )}
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-2 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md
                transition-all duration-200
                ${active
                  ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                  : 'text-muted-foreground hover:bg-card-hover hover:text-foreground'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.label : undefined}
              aria-label={item.label}
            >
              {item.icon}
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer - Version Info */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-sm font-mono font-bold text-primary">LK</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Self-Hosted</p>
              <p className="text-xs text-muted-foreground font-mono">v1.0.0</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
