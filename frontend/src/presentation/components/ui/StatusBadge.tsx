import React from 'react';

export type StatusVariant = 'active' | 'closed' | 'error' | 'connecting' | 'success' | 'warning' | 'info';

interface StatusBadgeProps {
  status: StatusVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

/**
 * Status badge component for displaying different states
 * Matches LiveKit Cloud Dashboard aesthetic
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  size = 'sm',
  showDot = true,
  className = ''
}) => {
  const statusStyles = {
    active: 'bg-success/10 text-success border-success/20',
    closed: 'bg-muted/50 text-muted-foreground border-border',
    error: 'bg-destructive/10 text-destructive border-destructive/20',
    connecting: 'bg-warning/10 text-warning border-warning/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    info: 'bg-info/10 text-info border-info/20',
  };

  const dotColors = {
    active: 'bg-success',
    closed: 'bg-muted-foreground',
    error: 'bg-destructive',
    connecting: 'bg-warning',
    success: 'bg-success',
    warning: 'bg-warning',
    info: 'bg-info',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded border font-medium ${statusStyles[status]} ${sizeStyles[size]} ${className}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2 mr-1.5">
          {status === 'active' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[status]}`}></span>
        </span>
      )}
      {children}
    </span>
  );
};