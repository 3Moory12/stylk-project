
import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/**
 * Button variants using class-variance-authority
 */
const buttonVariants = cva(
  // Base styles applied to all buttons
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      // Visual variant
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500",
        ghost: "bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
      },
      // Size variant
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
      },
      // Full width variant
      fullWidth: {
        true: "w-full",
      },
    },
    // Default variants
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

/**
 * Button component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.variant] - Visual variant (primary, secondary, outline, ghost, danger)
 * @param {string} [props.size] - Button size (sm, md, lg, icon)
 * @param {boolean} [props.fullWidth] - Whether the button should take full width
 * @param {boolean} [props.isLoading] - Whether the button is in loading state
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ButtonHTMLAttributes} props.rest - All other props are passed to the button element
 * @returns {React.ReactElement} Button component
 */
export default function Button({
  children,
  variant,
  size,
  fullWidth,
  isLoading = false,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size, fullWidth }),
        isLoading && "relative !text-transparent",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      {children}
    </button>
  );
}

/**
 * Export the button variants for use in other components
 */
export { buttonVariants };
