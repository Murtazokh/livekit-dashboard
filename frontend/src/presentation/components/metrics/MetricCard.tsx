import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  chart?: React.ReactNode;
  className?: string;
  iconColor?: string;
}

/**
 * MetricCard component for displaying key metrics
 * Matches LiveKit Cloud Dashboard aesthetic
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  chart,
  className = '',
  iconColor = 'text-primary',
}) => {
  return (
    <div
      className={`bg-card text-card-foreground rounded-lg border p-6 hover:border-primary/50 transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  trend.isPositive ? 'text-success' : 'text-destructive'
                }`}
              >
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {trend.isPositive ? (
                    <path d="M6 9V3M3 6l3-3 3 3" />
                  ) : (
                    <path d="M6 3v6M3 6l3 3 3-3" />
                  )}
                </svg>
                <span>
                  {Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>
        </div>
        {icon && (
          <div className={`p-3 bg-primary/10 rounded-lg ${iconColor}`}>
            {icon}
          </div>
        )}
      </div>

      {/* Mini chart area */}
      {chart && (
        <div className="mt-4 pt-4 border-t border-border/50">
          {chart}
        </div>
      )}
    </div>
  );
};
