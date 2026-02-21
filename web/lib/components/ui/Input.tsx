import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  variant?: 'filled' | 'outlined' | 'standard';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    helpText,
    icon,
    variant = 'outlined',
    className = '',
    disabled = false,
    ...props
  }, ref) => {
    const variantClasses = {
      filled: 'bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500',
      outlined: 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900',
      standard: 'bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-primary-500 rounded-none',
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={`
              w-full
              px-4 py-2
              text-base
              font-sans
              rounded-lg
              transition-all duration-200
              placeholder-gray-400 dark:placeholder-gray-500
              ${icon ? 'pl-10' : ''}
              ${variantClasses[variant]}
              ${error ? 'border-error-500 focus:ring-error-100 dark:focus:ring-error-900' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''}
              focus-visible:outline-none
              ${className}
            `}
            {...props}
          />
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

Input.displayName = 'Input';

/* Textarea */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    label,
    error,
    helpText,
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
        <textarea
          ref={ref}
          disabled={disabled}
          className={`
            w-full
            px-4 py-2
            text-base
            font-sans
            rounded-lg
            border-2 border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900
            transition-all duration-200
            placeholder-gray-400 dark:placeholder-gray-500
            resize-vertical
            ${error ? 'border-error-500 focus:ring-error-100 dark:focus:ring-error-900' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''}
            focus-visible:outline-none
            ${className}
          `}
          {...props}
        />
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

Textarea.displayName = 'Textarea';

/* Checkbox */
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    label,
    className = '',
    ...props
  }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          className={`
            w-5 h-5
            rounded-md
            border-2 border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            cursor-pointer
            transition-all duration-200
            accent-primary-500
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
            ${className}
          `}
          {...props}
        />
        {label && (
          <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

/* Radio */
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({
    label,
    className = '',
    ...props
  }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="radio"
          className={`
            w-5 h-5
            rounded-full
            border-2 border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            cursor-pointer
            transition-all duration-200
            accent-primary-500
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
            ${className}
          `}
          {...props}
        />
        {label && (
          <label className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
