import React from 'react';
import { SearchInput } from './SearchInput';
import { TimeRangeSelect } from './TimeRangeSelect';
import type { TimeRange } from './TimeRangeSelect';

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
  isAutoRefreshEnabled: boolean;
  onAutoRefreshToggle: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

/**
 * FilterBar component with search, time range, and refresh controls
 * Matches LiveKit Cloud Dashboard professional aesthetic
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  timeRange,
  onTimeRangeChange,
  isAutoRefreshEnabled,
  onAutoRefreshToggle,
  onRefresh,
  isRefreshing = false,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-card border border-border rounded-lg ${className}`}
    >
      {/* Search Input */}
      <SearchInput
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search sessions..."
        className="flex-1 min-w-[200px]"
      />

      {/* Time Range Selector */}
      <TimeRangeSelect
        value={timeRange}
        onChange={onTimeRangeChange}
        className="sm:w-auto"
      />

      {/* Divider */}
      <div className="hidden sm:block h-8 w-px bg-border" />

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Auto-refresh Toggle */}
        <button
          onClick={onAutoRefreshToggle}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            isAutoRefreshEnabled
              ? 'bg-success/10 text-success border border-success/20 hover:bg-success/20'
              : 'bg-card text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground'
          }`}
          aria-label={isAutoRefreshEnabled ? 'Disable auto-refresh' : 'Enable auto-refresh'}
        >
          <svg
            className={`w-4 h-4 ${isAutoRefreshEnabled ? 'animate-spin-slow' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          <span className="hidden sm:inline">Auto</span>
        </button>

        {/* Manual Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh data"
          >
            <svg
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}
      </div>
    </div>
  );
};
