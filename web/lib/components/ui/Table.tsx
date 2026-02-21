import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  variant?: 'striped' | 'bordered' | 'transparent';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({
    variant = 'striped',
    size = 'md',
    className = '',
    children,
    ...props
  }, ref) => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table
          ref={ref}
          className={`
            w-full
            border-collapse
            ${sizeClasses[size]}
            ${className}
          `}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

/* Table Head */
export const TableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <thead
      ref={ref}
      className={`
        bg-gray-50 dark:bg-gray-800
        border-b-2 border-gray-200 dark:border-gray-700
        ${className}
      `}
      {...props}
    />
  )
);

TableHead.displayName = 'TableHead';

/* Table Body */
export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <tbody
      ref={ref}
      className={`${className}`}
      {...props}
    />
  )
);

TableBody.displayName = 'TableBody';

/* Table Row */
export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className = '', ...props }, ref) => (
    <tr
      ref={ref}
      className={`
        border-b border-gray-200 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-800
        transition-colors duration-200
        ${className}
      `}
      {...props}
    />
  )
);

TableRow.displayName = 'TableRow';

/* Table Header Cell */
export const TableHeaderCell = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <th
      ref={ref}
      className={`
        px-6 py-3
        text-left
        font-semibold
        text-gray-900 dark:text-white
        uppercase
        tracking-wide
        text-xs
        ${className}
      `}
      {...props}
    />
  )
);

TableHeaderCell.displayName = 'TableHeaderCell';

/* Table Data Cell */
export const TableDataCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <td
      ref={ref}
      className={`
        px-6 py-4
        text-gray-900 dark:text-gray-100
        ${className}
      `}
      {...props}
    />
  )
);

TableDataCell.displayName = 'TableDataCell';

/* Tabs */
export interface TabsProps {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>;
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="w-full">
      {/* Tab List */}
      <div className="flex border-b-2 border-gray-200 dark:border-gray-700 gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              px-4 py-3
              font-medium
              transition-all duration-200
              border-b-2 -mb-0.5
              ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';
