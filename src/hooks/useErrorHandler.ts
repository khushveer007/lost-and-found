import { useState, useCallback } from 'react';

interface ErrorState {
  hasError: boolean;
  message: string | null;
  field?: string | null;
  timestamp: number;
}

/**
 * Custom hook for handling errors throughout the application
 * Provides methods for setting, clearing, and logging errors
 */
export function useErrorHandler() {
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: null,
    field: null,
    timestamp: 0
  });

  /**
   * Set an error with the given message and optional field
   */
  const setErrorMessage = useCallback((message: string, field?: string) => {
    console.error(`Error${field ? ` in ${field}` : ''}: ${message}`);
    setError({
      hasError: true,
      message,
      field: field || null,
      timestamp: Date.now()
    });
    
    // Automatically focus the field if it exists
    if (field) {
      setTimeout(() => {
        const element = document.getElementById(field);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, []);

  /**
   * Clear the current error
   */
  const clearError = useCallback(() => {
    setError({
      hasError: false,
      message: null,
      field: null,
      timestamp: 0
    });
  }, []);

  /**
   * Handle an error object, extracting useful information
   */
  const handleError = useCallback((err: any, defaultMessage: string = 'An unexpected error occurred') => {
    // Extract the most useful error message
    let errorMessage = defaultMessage;
    
    if (err) {
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.error) {
        errorMessage = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
      }
    }
    
    setErrorMessage(errorMessage);
    
    // Return the error for further processing
    return { message: errorMessage };
  }, [setErrorMessage]);

  return {
    error,
    setError: setErrorMessage,
    clearError,
    handleError
  };
}
