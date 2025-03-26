import { ReactNode } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { Button } from './button';

interface NavigationButtonProps {
  to: string;
  children: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onClick?: () => void;
}

export function NavigationButton({ 
  to, 
  children, 
  variant = 'default',
  size = 'default',
  className = '',
  onClick
}: NavigationButtonProps) {
  const { navigateTo } = useNavigation();
  
  const handleClick = () => {
    navigateTo(to);
    if (onClick) onClick();
  };
  
  return (
    <Button 
      variant={variant} 
      size={size}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
