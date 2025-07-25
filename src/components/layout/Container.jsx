
import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Container sizes configuration
 */
const containerSizes = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

/**
 * Container component for consistent page width
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Container content
 * @param {string} [props.size] - Container size (sm, md, lg, xl, 2xl, full)
 * @param {boolean} [props.centered] - Whether to center the container
 * @param {string} [props.className] - Additional CSS classes
 */
export default function Container({
  children,
  size = 'lg',
  centered = true,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        containerSizes[size] || containerSizes.lg,
        centered && 'mx-auto',
        'px-4 sm:px-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
