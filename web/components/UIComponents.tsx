/**
 * Common UI components and utilities
 */

import React from 'react';
import Skeleton from './Skeleton';

/**
 * Loading spinner component
 */
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClass = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }[size];

  return (
    <div className={`${sizeClass} border-blue-500 border-t-transparent rounded-full animate-spin`} />
  );
};

/**
 * Loading state component with spinner
 */
export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

/**
 * Empty state component
 */
export const EmptyState: React.FC<{
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      {icon && <div className="text-4xl opacity-50">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="text-gray-600">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

/**
 * Error state component
 */
export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({ title = 'Error', message = 'Something went wrong', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="text-4xl">⚠️</div>
      <h3 className="text-lg font-semibold text-red-900">{title}</h3>
      <p className="text-red-800">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

/**
 * Data loading skeleton list
 */
export const SkeletonList: React.FC<{ count?: number; columns?: number }> = ({
  count = 3,
  columns = 1,
}) => {
  return (
    <div className={`grid gap-4 ${columns > 1 ? `grid-cols-${columns}` : ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 bg-white rounded-lg border border-gray-200">
          <Skeleton count={3} height={16} />
        </div>
      ))}
    </div>
  );
};

/**
 * Async data wrapper component
 */
export interface AsyncDataProps<T> {
  data?: T;
  isLoading: boolean;
  error?: Error | null;
  render: (data: T) => React.ReactNode;
  loadingFallback?: React.ReactNode;
  errorFallback?: (error: Error, retry: () => void) => React.ReactNode;
  onRetry?: () => void;
}

export function AsyncData<T>({
  data,
  isLoading,
  error,
  render,
  loadingFallback,
  errorFallback,
  onRetry,
}: AsyncDataProps<T>) {
  if (isLoading) {
    return <>{loadingFallback || <LoadingState />}</>;
  }

  if (error) {
    return (
      <>
        {errorFallback ? (
          errorFallback(error, onRetry || (() => {}))
        ) : (
          <ErrorState message={error.message} onRetry={onRetry} />
        )}
      </>
    );
  }

  if (!data) {
    return <EmptyState title="No data available" />;
  }

  return <>{render(data)}</>;
}

export default {
  LoadingSpinner,
  LoadingState,
  EmptyState,
  ErrorState,
  SkeletonList,
  AsyncData,
};
