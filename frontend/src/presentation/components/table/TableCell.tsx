import React from 'react';

interface TableCellProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  mono?: boolean;
}

/**
 * Table cell component matching LiveKit Cloud style
 */
export const TableCell: React.FC<TableCellProps> = ({
  children,
  align = 'left',
  className = '',
  mono = false,
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td
      className={`
        px-4 py-3 text-sm
        ${alignClasses[align]}
        ${mono ? 'font-mono' : ''}
        ${className}
      `}
    >
      {children}
    </td>
  );
};
