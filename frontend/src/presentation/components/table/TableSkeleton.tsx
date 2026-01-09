import React from 'react';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';

interface TableSkeletonProps {
  columns: { label: string; align?: 'left' | 'center' | 'right' }[];
  rows?: number;
}

/**
 * Skeleton loader for data table
 */
export const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows = 5 }) => {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full bg-card">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              {columns.map((column, index) => (
                <TableHeader key={index} align={column.align}>
                  {column.label}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <div className="animate-pulse">
                      <div
                        className="h-4 bg-muted rounded"
                        style={{
                          width: `${60 + Math.random() * 40}%`,
                        }}
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
