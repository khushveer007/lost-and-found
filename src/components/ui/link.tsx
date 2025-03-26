import { ReactNode } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'button' | 'button-outline';
  onClick?: () => void;
}

export function Link({ to, children, className = '', variant = 'default', onClick }: LinkProps) {
  const { navigateTo } = useNavigation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo(to);
    if (onClick) onClick();
  };
  
  const variantClasses = {
    'default': 'text-primary hover:underline',
    'button': 'inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium',
    'button-outline': 'inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium',
  };
  
  return (
    <button 
      onClick={handleClick}
      className={`${className} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
