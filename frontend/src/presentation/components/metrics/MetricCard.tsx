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
      className={`bg-card text-card-foreground rounded-lg border border-border hover:border-primary/40 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative group ${className}`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Title - Technical uppercase */}
            <p className="text-xs font-mono font-bold text-muted-foreground mb-3 uppercase tracking-widest">
              {title}
            </p>
            {/* Value - Large monospace number */}
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-mono font-extrabold counter-up">{value}</p>
              {trend && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono font-semibold ${
                    trend.isPositive
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-destructive/10 text-destructive border border-destructive/20'
                  }`}
                >
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
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
          {/* Icon with glow effect */}
          {icon && (
            <div className={`p-3 bg-primary/10 border border-primary/20 rounded-md ${iconColor} group-hover:shadow-lg group-hover:scale-105 transition-all`}>
              {icon}
            </div>
          )}
        </div>

        {/* Mini chart area with technical separator */}
        {chart && (
          <div className="mt-6 pt-4 border-t border-border/50">
            {chart}
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};
