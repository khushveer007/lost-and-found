import { supabase } from '@/services/api';

/**
 * Utility for checking if session persistence is working correctly
 */
export const checkSessionPersistence = async (): Promise<{
  hasLocalStorage: boolean;
  hasSession: boolean;
}> => {
  // Check if localStorage is available
  let hasLocalStorage = false;
  try {
    const testKey = 'supabase.test';
    localStorage.setItem(testKey, 'test');
    hasLocalStorage = localStorage.getItem(testKey) === 'test';
    localStorage.removeItem(testKey);
  } catch (e) {
    console.error('LocalStorage not available:', e);
  }

  // Check if there is an active session
  let hasSession = false;
  try {
    const { data } = await supabase.auth.getSession();
    hasSession = !!data.session;
  } catch (e) {
    console.error('Error checking session:', e);
  }

  return { hasLocalStorage, hasSession };
};

/**
 * Watches for session changes and logs them for debugging
 */
export const initSessionWatcher = () => {
  if (typeof window === 'undefined') return;

  // Watch for auth state changes
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    console.log(`[Auth] Event: ${event}`, { hasSession: !!session });
  });

  // Check for session issues periodically
  const intervalId = setInterval(async () => {
    const { hasLocalStorage, hasSession } = await checkSessionPersistence();
    if (!hasLocalStorage) {
      console.warn('[Session Warning] LocalStorage not available - sessions will not persist');
    }
    if (!hasSession) {
      console.info('[Session Info] No active session found');
    }
  }, 30000); // Check every 30 seconds

  // Cleanup function
  return () => {
    authListener.subscription.unsubscribe();
    clearInterval(intervalId);
  };
};
