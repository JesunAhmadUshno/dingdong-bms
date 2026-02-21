import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  options: Array<{ value: string | number; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    label,
    error,
    helpText,
    icon,
    options,
    className = '',
    disabled = false,
    ...props
  }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            disabled={disabled}
            className={`
              w-full
              px-4 py-2
              ${icon ? 'pl-10' : ''}
              text-base
              font-sans
              rounded-lg
              border-2 border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-800
              focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900
              transition-all duration-200
              appearance-none
              cursor-pointer
              ${error ? 'border-error-500' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''}
              focus-visible:outline-none
              ${className}
            `}
            {...props}
          >
            <option value="">Select an option</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {error ? (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            {error}
          </p>
        ) : helpText ? (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helpText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
