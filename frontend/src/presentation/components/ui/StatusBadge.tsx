import React from 'react';

interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'active' | 'inactive';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Status badge component for displaying different states
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  size = 'sm',
  className = ''
}) => {
  const statusStyles = {
    success: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    error: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    warning: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    info: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    active: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    inactive: 'bg-muted text-muted-foreground border-muted-foreground/20',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${statusStyles[status]} ${sizeStyles[size]} ${className}`}
    >
      <span className="relative flex h-2 w-2 mr-2">
        {status === 'active' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${
          status === 'success' ? 'bg-green-500' :
          status === 'error' ? 'bg-red-500' :
          status === 'warning' ? 'bg-yellow-500' :
          status === 'info' ? 'bg-blue-500' :
          status === 'active' ? 'bg-green-500' :
          'bg-muted-foreground'
        }`}></span>
      </span>
      {children}
    </span>
  );
};