import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  showMessage?: boolean;
  className?: string;
}

/**
 * A spinner component that provides visual loading feedback
 */
export function LoadingSpinner({
  size = 'md',
  message = 'Loading...',
  showMessage = true,
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full border-primary/30 border-t-primary animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {showMessage && (
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

/**
 * A progress indicator that shows the stage of a multi-step process
 */
export function ProcessSteps({
  steps,
  currentStep,
  className = ''
}: {
  steps: string[];
  currentStep: number;
  className?: string;
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`text-xs font-medium ${
              index === currentStep 
                ? 'text-primary' 
                : index < currentStep 
                  ? 'text-primary/70' 
                  : 'text-muted-foreground'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div 
          className="bg-primary h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
