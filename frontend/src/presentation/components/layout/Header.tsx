import React from 'react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

/**
 * Page header component with breadcrumbs and actions
 */
export const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
  const location = useLocation();

  // Generate breadcrumbs from path
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return [{ label: 'Overview', path: '/' }];

    const breadcrumbs = paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      return { label, path: href };
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const pageTitle = title || breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm mb-1">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && (
                  <svg
                    className="w-4 h-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground cursor-pointer'
                  }
                >
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>

          {/* Page Title */}
          <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>

        {/* Actions */}
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
    </header>
  );
};
