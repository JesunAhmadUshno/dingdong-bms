import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    variant = 'elevated',
    size = 'md',
    className = '',
    children,
    ...props
  }, ref) => {
    const variantClasses = {
      elevated: 'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700',
      outlined: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600',
      filled: 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600',
    };

    const sizeClasses = {
      sm: 'p-4 rounded-md',
      md: 'p-6 rounded-lg',
      lg: 'p-8 rounded-xl',
    };

    return (
      <div
        ref={ref}
        className={`
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          transition-all duration-200
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/* Card Header */
export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`pb-4 border-b border-gray-200 dark:border-gray-700 mb-4 ${className}`}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

/* Card Title */
export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...props }, ref) => (
    <h2
      ref={ref}
      className={`text-xl font-bold text-gray-900 dark:text-white ${className}`}
      {...props}
    >
      {children}
    </h2>
  )
);

CardTitle.displayName = 'CardTitle';

/* Card Description */
export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', children, ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-gray-600 dark:text-gray-400 mt-1 ${className}`}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

/* Card Content */
export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`${className}`}
      {...props}
    />
  )
);

CardContent.displayName = 'CardContent';

/* Card Footer */
export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`pt-4 border-t border-gray-200 dark:border-gray-700 mt-4 flex gap-2 justify-end ${className}`}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';
