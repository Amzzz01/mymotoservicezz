import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'brand' | 'white';
  className?: string;
}

const sizeClasses: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-4',
};

const variantClasses: Record<NonNullable<SpinnerProps['variant']>, string> = {
  brand: 'border-cyan-500 dark:border-cyan-400 border-t-transparent',
  white: 'border-white border-t-transparent',
};

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', variant = 'brand', className = '' }) => (
  <div
    role="status"
    aria-label="Loading"
    className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full animate-spin ${className}`}
  />
);

export default Spinner;
