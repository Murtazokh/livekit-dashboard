import React, { useState, useRef, useEffect } from 'react';

export type TimeRange = 'last_hour' | 'last_24_hours' | 'last_7_days' | 'custom';

interface TimeRangeOption {
  value: TimeRange;
  label: string;
}

interface TimeRangeSelectProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
}

const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: 'last_hour', label: 'Last hour' },
  { value: 'last_24_hours', label: 'Last 24 hours' },
  { value: 'last_7_days', label: 'Last 7 days' },
  { value: 'custom', label: 'Custom range' },
];

/**
 * TimeRangeSelect dropdown component
 */
export const TimeRangeSelect: React.FC<TimeRangeSelectProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = TIME_RANGE_OPTIONS.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: TimeRange) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card text-foreground border border-border rounded-lg text-sm hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
      >
        <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
        <span>{selectedOption?.label}</span>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in">
          {TIME_RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-primary/10 transition-colors ${
                option.value === value ? 'bg-primary/20 text-primary font-medium' : 'text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
