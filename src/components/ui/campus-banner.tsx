import { ReactNode } from 'react';

interface CampusBannerProps {
  children?: ReactNode;
  className?: string;
}

export function CampusBanner({ children, className = '' }: CampusBannerProps) {
  return (
    <div className={`bg-primary/10 border border-primary/20 rounded-lg p-3 text-center ${className}`}>
      <p className="text-sm font-medium text-primary">
        {children || "Free LostLink campus service - No payment required"}
      </p>
    </div>
  );
}
