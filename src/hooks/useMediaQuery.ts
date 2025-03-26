import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design and media queries
 * @param query The media query to match
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with a default value based on the current window
  const getMatches = (query: string): boolean => {
    // For SSR, return false initially
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Initial check
    setMatches(mediaQuery.matches);
    
    // Event listener callback
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add the listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

// Common breakpoint helpers
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
