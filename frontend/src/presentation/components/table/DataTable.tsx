import React, { useState } from 'react';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

/**
 * Generic data table component matching LiveKit Cloud Dashboard style
 * Features: sorting, row click, responsive, professional styling
 */
export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No data available',
  className = '',
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  // Handle column sort
  const handleSort = (columnKey: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  // Sort data based on current sort config
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a: any, b: any) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  // Empty state
  if (data.length === 0) {
    return (
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                {columns.map((column) => (
                  <TableHeader key={column.key} align={column.align}>
                    {column.label}
                  </TableHeader>
                ))}
              </tr>
            </thead>
          </table>
        </div>
        <div className="py-16 text-center animate-fade-in">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-base font-semibold text-foreground mb-1">No sessions found</h3>
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full bg-card">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              {columns.map((column) => (
                <TableHeader
                  key={column.key}
                  align={column.align}
                  sortable={column.sortable}
                  sortDirection={
                    sortConfig?.key === column.key ? sortConfig.direction : null
                  }
                  onSort={() => column.sortable && handleSort(column.key)}
                  className={column.className}
                >
                  {column.label}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <TableRow
                key={keyExtractor(item)}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    align={column.align}
                    className={column.className}
                  >
                    {column.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
