import React from 'react';

export type FeatureType = 'recording' | 'sip' | 'agents' | 'transcription';

interface FeatureBadgeProps {
  type: FeatureType;
  count?: number;
  children?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * FeatureBadge component for displaying room features
 * Matches LiveKit Cloud Dashboard aesthetic
 */
export const FeatureBadge: React.FC<FeatureBadgeProps> = ({
  type,
  count,
  children,
  size = 'sm',
  className = '',
}) => {
  const featureStyles = {
    recording: {
      bg: 'bg-destructive/10',
      text: 'text-destructive',
      border: 'border-destructive/20',
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="8" />
        </svg>
      ),
      label: 'Recording',
    },
    sip: {
      bg: 'bg-info/10',
      text: 'text-info',
      border: 'border-info/20',
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
      label: 'SIP',
    },
    agents: {
      bg: 'bg-success/10',
      text: 'text-success',
      border: 'border-success/20',
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a4 4 0 00-4 4v4a4 4 0 008 0V6a4 4 0 00-4-4z" />
          <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M8 22h8" />
        </svg>
      ),
      label: 'Agents',
    },
    transcription: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      border: 'border-warning/20',
      icon: (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      ),
      label: 'Transcription',
    },
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const feature = featureStyles[type];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border font-medium ${feature.bg} ${feature.text} ${feature.border} ${sizeStyles[size]} ${className}`}
    >
      {feature.icon}
      <span>
        {children || feature.label}
        {count !== undefined && ` ${count}`}
      </span>
    </span>
  );
};
