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
      className="absolute left-0 p-2 -translate-y-full focus:translate-y-0 bg-background z-50"
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
    <style dangerouslySetInnerHTML={{
      __html: `
        :focus-visible {
          outline: 2px solid var(--focus-ring);
          outline-offset: 2px;
        }
      `
    }} />
  );
}

interface ScreenReaderAnnounceProps {
  message: string;
  assertive?: boolean;
}

/**
 * Announces messages to screen readers using ARIA live regions
 */
export function ScreenReaderAnnounce({ 
  message,
  assertive = false
}: ScreenReaderAnnounceProps) {
  return (
    <div 
      aria-live={assertive ? "assertive" : "polite"} 
      className="sr-only"
    >
      {message}
    </div>
  );
}
