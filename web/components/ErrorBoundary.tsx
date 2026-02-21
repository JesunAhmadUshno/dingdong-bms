/**
 * Error boundary component for catching and displaying React errors
 */

import React, { ReactNode, useState } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary class component
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error);
      }

      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
          <details className="mb-4">
            <summary className="cursor-pointer text-red-700 hover:text-red-900">
              Error details
            </summary>
            <pre className="mt-2 text-sm bg-white p-3 border border-red-200 rounded overflow-auto max-h-40">
              {this.state.error.toString()}
            </pre>
          </details>
          <button
            onClick={this.resetError}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for handling errors in functional components
 */
export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = (err: Error | string) => {
    const error = typeof err === 'string' ? new Error(err) : err;
    setError(error);
    // Re-throw to trigger error boundary if this hook is used within one
    throw error;
  };

  const resetError = () => {
    setError(null);
  };

  return { error, handleError, resetError };
}

/**
 * Error fallback component for API errors
 */
export const ApiErrorFallback: React.FC<{ error: Error; retry?: () => void }> = ({
  error,
  retry,
}) => {
  return (
    <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
      <h3 className="font-semibold text-amber-900 mb-2">API Error</h3>
      <p className="text-sm text-amber-800 mb-4">{error.message}</p>
      <div className="flex gap-2">
        {retry && (
          <button
            onClick={retry}
            className="px-3 py-2 bg-amber-600 text-white text-sm rounded hover:bg-amber-700"
          >
            Retry
          </button>
        )}
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
        >
          Reload
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
