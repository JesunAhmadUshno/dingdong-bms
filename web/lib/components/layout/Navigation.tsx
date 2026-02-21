import React from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: number;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  items: NavItem[];
  activeItem?: string;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  items,
  activeItem,
  className = '',
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          left-0 top-0 h-screen
          w-64 bg-gray-900 dark:bg-gray-950
          overflow-y-auto
          transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${className}
        `}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">DB</span>
            </div>
            <span className="text-white font-bold text-lg">DingDong BMS</span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  activeItem === item.href
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              {item.icon && <span className="w-5 h-5">{item.icon}</span>}
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-1 text-xs font-semibold bg-error-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

Sidebar.displayName = 'Sidebar';

/* Navbar */
export interface NavbarProps {
  onMenuClick?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  rightContent,
  className = '',
}) => {
  return (
    <header
      className={`
        bg-white dark:bg-gray-800
        border-b border-gray-200 dark:border-gray-700
        sticky top-0 z-30
        ${className}
      `}
    >
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back to DingDong BMS</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {rightContent}
        </div>
      </div>
    </header>
  );
};

Navbar.displayName = 'Navbar';

/* Footer */
interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  links?: FooterLink[];
  copyright?: string;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  links = [],
  copyright = `© ${new Date().getFullYear()} DingDong Building Management System. All rights reserved.`,
  className = '',
}) => {
  return (
    <footer
      className={`
        bg-gray-900 dark:bg-gray-950
        border-t border-gray-800
        py-8 px-6
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto">
        {links.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-800">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {copyright}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20v-7.21H5.5V9.25h2.79V7.11c0-2.76 1.68-4.26 4.15-4.26 1.18 0 2.2.09 2.49.13v2.88h-1.71c-1.34 0-1.6.64-1.6 1.57v2.05h3.2l-.41 3.54h-2.79V20h-3.43z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';
