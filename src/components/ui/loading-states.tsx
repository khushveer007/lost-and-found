import React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * A spinner component to indicate loading states
 */
export function LoadingSpinner({ size = 'medium', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };
  
  return (
    <div 
      className={cn(
        'rounded-full border-t-2 border-primary animate-spin',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  variant?: 'line' | 'circle' | 'rect';
  width?: string;
  height?: string;
  animated?: boolean;
  count?: number;
}

/**
 * Skeleton loading component for showing placeholder content while data loads
 */
export function Skeleton({
  className,
  variant = 'line',
  width,
  height,
  animated = true,
  count = 1
}: SkeletonProps) {
  const baseClasses = cn(
    'bg-muted',
    animated && 'animate-pulse',
    className
  );
  
  const items = Array.from({ length: count }).map((_, index) => {
    if (variant === 'circle') {
      return (
        <div 
          key={index}
          className={cn(
            baseClasses,
            'rounded-full'
          )}
          style={{
            width: width || '2.5rem',
            height: height || width || '2.5rem'
          }}
          aria-hidden="true"
        />
      );
    }
    
    if (variant === 'rect') {
      return (
        <div 
          key={index}
          className={cn(
            baseClasses,
            'rounded'
          )}
          style={{
            width: width || '100%',
            height: height || '100px'
          }}
          aria-hidden="true"
        />
      );
    }
    
    // Default 'line' variant
    return (
      <div 
        key={index}
        className={cn(
          baseClasses,
          'rounded h-4 mb-2'
        )}
        style={{
          width: width || '100%',
          height: height || undefined
        }}
        aria-hidden="true"
      />
    );
  });
  
  return <>{items}</>;
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  spinner?: boolean;
}

/**
 * Overlay component to indicate loading state over content
 */
export function LoadingOverlay({
  isLoading,
  children,
  text = 'Loading...',
  spinner = true
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="flex flex-col items-center space-y-4">
            {spinner && <LoadingSpinner size="large" />}
            {text && <p className="text-center font-medium">{text}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Component to show when an error occurs
 */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div 
      className="p-6 border rounded-lg bg-destructive/10 text-center"
      role="alert"
      aria-live="assertive"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="w-12 h-12 mx-auto mb-4 text-destructive"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h3 className="text-lg font-semibold mb-2">Error</h3>
      <p className="mb-4">{message}</p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Component to show when there is no data to display
 */
export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="py-12 flex flex-col items-center text-center px-4">
      {icon || (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-12 h-12 mb-4 text-muted-foreground"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      )}
      
      <h3 className="text-lg font-semibold">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground mt-2 max-w-sm">{description}</p>
      )}
      
      {action && (
        <Button 
          onClick={action.onClick}
          className="mt-6"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
