/**
 * Debug utilities for troubleshooting authentication issues
 */

// Enable this to turn on detailed authentication debugging
const AUTH_DEBUG = true;

export const debugLog = (context: string, ...args: unknown[]) => {
  if (AUTH_DEBUG) {
    console.log(`[${context}]`, ...args);
  }
};

export const debugError = (context: string, ...args: unknown[]) => {
  if (AUTH_DEBUG) {
    console.error(`[${context}]`, ...args);
  }
};

export const debugWarn = (context: string, ...args: unknown[]) => {
  if (AUTH_DEBUG) {
    console.warn(`[${context}]`, ...args);
  }
};

// Helper to inspect authentication flow
export const inspectAuthFlow = (action: string, data: unknown) => {
  if (AUTH_DEBUG) {
    console.group(`Auth Flow: ${action}`);
    console.log('Data:', data);
    console.groupEnd();
  }
};
