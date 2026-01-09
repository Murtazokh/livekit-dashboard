import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

/**
 * Container wrapper for page content with consistent padding
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'full',
  className = '',
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-none',
  };

  return (
    <div className={`mx-auto px-6 py-6 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};
