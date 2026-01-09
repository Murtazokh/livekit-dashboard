import React from 'react';

interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Table row component with hover effect
 */
export const TableRow: React.FC<TableRowProps> = ({ children, onClick, className = '' }) => {
  return (
    <tr
      onClick={onClick}
      className={`
        border-b border-border-subtle
        transition-colors duration-150
        hover:bg-card-hover
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </tr>
  );
};
