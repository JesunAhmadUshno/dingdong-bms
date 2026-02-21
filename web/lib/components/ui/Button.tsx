import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    disabled = false,
    className = '',
    children,
    ...props
  }, ref) => {
    // Variant styles
    const variantClasses = {
      primary: 'bg-primary-500 hover:bg-primary-600 text-white active:bg-primary-700',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 active:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
      danger: 'bg-error-500 hover:bg-error-600 text-white active:bg-error-700',
      success: 'bg-success-500 hover:bg-success-600 text-white active:bg-success-700',
      outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100 dark:hover:bg-primary-900 dark:active:bg-primary-800',
      ghost: 'text-primary-600 hover:bg-primary-50 active:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-900 dark:active:bg-primary-800',
    };

    // Size styles
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm font-medium rounded-md',
      md: 'px-4 py-2 text-base font-medium rounded-lg',
      lg: 'px-6 py-3 text-lg font-semibold rounded-lg',
    };

    const disabledClasses = disabled || isLoading
      ? 'opacity-60 cursor-not-allowed'
      : 'transition-colors duration-200 active:scale-95 transform';

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${disabledClasses}
          ${widthClass}
          flex items-center justify-center gap-2
          font-sans
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
          ${className}
        `}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
