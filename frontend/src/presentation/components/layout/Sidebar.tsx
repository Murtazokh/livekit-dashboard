import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Video, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

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
      `}
    >
      {/* Collapse Toggle */}
      <div className="flex items-center justify-end px-2 py-3 border-b border-border">
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-md hover:bg-muted transition-colors group"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" strokeWidth={2} />
            ) : (
              <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground" strokeWidth={2} />
            )}
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
