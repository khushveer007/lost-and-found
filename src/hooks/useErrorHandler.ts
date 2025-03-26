import { useState, useCallback } from 'react';

interface ErrorState {
  hasError: boolean;
  message: string | null;
  field: string | null;
  timestamp: number;
}

interface UseErrorHandlerResult {
  error: ErrorState;
  setError: (message: string, field?: string) => void;
  clearError: () => void;
  setErrorMessage: (message: string) => void;
  handleError: (err: unknown, defaultMessage?: string) => { message: string };
}

/**
 * Custom hook for handling errors throughout the application
 */
export function useErrorHandler(): UseErrorHandlerResult {
  const [error, setErrorState] = useState<ErrorState>({
    hasError: false,
    message: null,
    field: null,
    timestamp: 0
  });

  const setError = useCallback((message: string, field?: string) => {
    setErrorState({
      hasError: true,
      message,
      field: field || null,
      timestamp: Date.now()
    });
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      message: null,
      field: null,
      timestamp: 0
    });
  }, []);

  const setErrorMessage = useCallback((message: string) => {
    setError(message);
  }, [setError]);

  const handleError = useCallback((err: unknown, defaultMessage = 'An unexpected error occurred') => {
    let errorMessage = defaultMessage;
    
    if (err) {
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const errObj = err as Record<string, any>;
        if (errObj.message) {
          errorMessage = errObj.message;
        } else if (errObj.error) {
          errorMessage = typeof errObj.error === 'string' 
            ? errObj.error 
            : JSON.stringify(errObj.error);
        }
      }
    }
    
    setErrorMessage(errorMessage);
    
    return { message: errorMessage };
  }, [setErrorMessage]);

  return {
    error,
    setError,
    clearError,
    setErrorMessage,
    handleError
  };
}
