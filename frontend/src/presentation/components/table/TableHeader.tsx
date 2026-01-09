import React from 'react';

interface TableHeaderProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  className?: string;
}

/**
 * Table header cell component with optional sorting
 */
export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  align = 'left',
  sortable = false,
  sortDirection = null,
  onSort,
  className = '',
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th
      onClick={sortable ? onSort : undefined}
      className={`
        px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider
        ${alignClasses[align]}
        ${sortable ? 'cursor-pointer hover:text-foreground select-none' : ''}
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        <span>{children}</span>
        {sortable && (
          <span className="inline-flex flex-col">
            {sortDirection === 'asc' ? (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14l5-5 5 5H7z" />
              </svg>
            ) : sortDirection === 'desc' ? (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 15l5-5 5 5M7 9l5 5 5-5" />
              </svg>
            )}
          </span>
        )}
      </div>
    </th>
  );
};
