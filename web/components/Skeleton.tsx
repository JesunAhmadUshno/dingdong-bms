/**
 * Skeleton loading component for better perceived performance
 */

import React from 'react';

export interface SkeletonProps {
  count?: number;
  height?: string | number;
  width?: string | number;
  circle?: boolean;
  className?: string;
  baseColor?: string;
  highlightColor?: string;
  duration?: number;
}

/**
 * Skeleton component for showing loading placeholders
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  height = 20,
  width = '100%',
  circle = false,
  className = '',
  baseColor = '#f0f0f0',
  highlightColor = '#e0e0e0',
  duration = 1.5,
}) => {
  const styles = `
    @keyframes shimmer {
      0% { background-color: ${baseColor}; }
      50% { background-color: ${highlightColor}; }
      100% { background-color: ${baseColor}; }
    }
    
    .skeleton {
      animation: shimmer ${duration}s infinite;
      background-color: ${baseColor};
      border-radius: ${circle ? '50%' : '4px'};
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className={className}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              height: typeof height === 'number' ? `${height}px` : height,
              width: typeof width === 'number' ? `${width}px` : width,
              marginBottom: i < count - 1 ? '12px' : '0',
            }}
          />
        ))}
      </div>
    </>
  );
};

/**
 * Skeleton for table rows
 */
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton height={20} width="80%" />
        </td>
      ))}
    </tr>
  );
};

/**
 * Skeleton for card content
 */
export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <Skeleton height={24} width="60%" />
      <div style={{ marginTop: '16px' }}>
        <Skeleton count={3} height={16} width="100%" />
      </div>
      <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
        <Skeleton height={40} width={120} />
        <Skeleton height={40} width={120} />
      </div>
    </div>
  );
};

/**
 * Skeleton for user avatar
 */
export const AvatarSkeleton: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return <Skeleton height={size} width={size} circle={true} />;
};

/**
 * Skeleton for form inputs
 */
export const FormInputSkeleton: React.FC = () => {
  return (
    <div className="mb-4">
      <Skeleton height={20} width="30%" />
      <div style={{ marginTop: '8px' }}>
        <Skeleton height={40} width="100%" />
      </div>
    </div>
  );
};

export default Skeleton;
