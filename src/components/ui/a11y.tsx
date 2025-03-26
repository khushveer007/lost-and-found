import { ReactNode } from 'react';

interface VisuallyHiddenProps {
  children: ReactNode;
}

/**
 * Renders content that is visually hidden but still accessible to screen readers
 */
export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return (
    <span 
      className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
      style={{ clip: 'rect(0, 0, 0, 0)' }}
    >
      {children}
    </span>
  );
}

interface SkipLinkProps {
  targetId: string;
  children?: ReactNode;
}

/**
 * Provides a skip link for keyboard navigation, helping users bypass
 * repetitive navigation elements
 */
export function SkipLink({ targetId, children = 'Skip to content' }: SkipLinkProps) {
  return (
    <a 
      href={`#${targetId}`}
      className="absolute top-0 left-0 p-3 -translate-y-full focus:translate-y-0 bg-primary text-primary-foreground z-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      {children}
    </a>
  );
}

/**
 * Enhances keyboard navigation focus states
 */
export function FocusRing() {
  return (
    <style jsx global>{`
      :focus-visible {
        outline: 2px solid hsl(var(--primary));
        outline-offset: 2px;
      }
      
      /* Remove default focus styles for mouse users */
      :focus:not(:focus-visible) {
        outline: none;
      }
    `}</style>
  );
}

/**
 * Announces messages to screen readers using ARIA live regions
 */
export function ScreenReaderAnnounce({ 
  message,
  assertive = false
}: { 
  message: string; 
  assertive?: boolean;
}) {
  // Uses aria-live to announce messages to screen readers
  return (
    <div 
      className="sr-only" 
      aria-live={assertive ? "assertive" : "polite"}
    >
      {message}
    </div>
  );
}
