import React, { useMemo } from 'react';

interface MiniChartProps {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  color?: string;
  fillOpacity?: number;
  className?: string;
}

/**
 * MiniChart component for displaying sparkline visualizations
 * Simple line chart for metric trends
 */
export const MiniChart: React.FC<MiniChartProps> = ({
  data,
  width = 120,
  height = 40,
  strokeWidth = 2,
  color = 'hsl(var(--primary))',
  fillOpacity = 0.1,
  className = '',
}) => {
  const { path, fillPath } = useMemo(() => {
    if (!data || data.length < 2) {
      return { path: '', fillPath: '' };
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1; // Avoid division by zero

    // Calculate points
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return { x, y };
    });

    // Create line path
    const linePath = points
      .map((point, index) => {
        if (index === 0) {
          return `M ${point.x},${point.y}`;
        }
        return `L ${point.x},${point.y}`;
      })
      .join(' ');

    // Create fill path (area under the line)
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

    return { path: linePath, fillPath: areaPath };
  }, [data, width, height]);

  if (!data || data.length < 2) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-xs text-muted-foreground">No data</span>
      </div>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`${className}`}
      preserveAspectRatio="none"
    >
      {/* Fill area */}
      <path
        d={fillPath}
        fill={color}
        fillOpacity={fillOpacity}
      />
      {/* Line */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
