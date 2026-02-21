import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'circle' | 'square';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  className = '',
  variant = 'circle',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const radiusClass = variant === 'circle' ? 'rounded-full' : 'rounded-lg';

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${radiusClass}
        bg-gradient-to-br from-primary-400 to-primary-600
        flex items-center justify-center
        overflow-hidden
        flex-shrink-0
        ${className}
      `}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : initials ? (
        <span className="font-semibold text-white">{initials}</span>
      ) : (
        <svg className="w-2/3 h-2/3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';

/* Badge */
export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200',
    success: 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-200',
    warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-200',
    error: 'bg-error-100 text-error-700 dark:bg-error-900 dark:text-error-200',
    info: 'bg-info-100 text-info-700 dark:bg-info-900 dark:text-info-200',
    neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs font-medium rounded-full',
    md: 'px-3 py-1 text-sm font-medium rounded-full',
  };

  return (
    <span
      className={`
        inline-flex items-center
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {label}
    </span>
  );
};

Badge.displayName = 'Badge';

/* Loading Spinner */
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <svg
        className={`animate-spin text-primary-500 ${sizeClasses[size]} ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';

/* Progress Bar */
export interface ProgressProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className = '',
}) => {
  const percentage = (value / max) * 100;

  const sizeClasses = {
    sm: 'h-1 rounded-full',
    md: 'h-2 rounded-lg',
    lg: 'h-3 rounded-lg',
  };

  const variantClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 dark:bg-gray-700 overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${variantClasses[variant]} ${sizeClasses[size]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {percentage.toFixed(0)}%
        </p>
      )}
    </div>
  );
};

Progress.displayName = 'Progress';
