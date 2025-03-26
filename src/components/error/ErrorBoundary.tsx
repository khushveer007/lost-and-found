import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch and handle JavaScript errors
 * anywhere in the component tree below it
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // You can render a custom fallback UI
      return fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 border rounded-lg bg-background">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
            
            <div className="bg-muted/50 rounded-md p-4 mb-6 text-left overflow-auto max-h-[200px]">
              <p className="text-sm font-mono">{error?.toString()}</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button onClick={this.handleReset}>
                Try again
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
