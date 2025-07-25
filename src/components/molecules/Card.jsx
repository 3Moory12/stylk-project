
import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Card component for containing content with optional header and footer
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.title] - Card title
 * @param {React.ReactNode} [props.header] - Custom header (overrides title)
 * @param {React.ReactNode} [props.footer] - Custom footer
 * @param {boolean} [props.noPadding] - Remove default padding
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.HTMLAttributes} props.rest - Additional HTML attributes
 */
export default function Card({
  children,
  title,
  header,
  footer,
  noPadding = false,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Header */}
      {(header || title) && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          {header || (
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>
          )}
        </div>
      )}

      {/* Content */}
      <div className={cn(!noPadding && "p-4")}>{children}</div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          {footer}
        </div>
      )}
    </div>
  );
}

/**
 * Card.Header component for custom header content
 */
Card.Header = function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "border-b border-gray-200 bg-gray-50 px-4 py-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card.Footer component for custom footer content
 */
Card.Footer = function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "border-t border-gray-200 bg-gray-50 px-4 py-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card.Title component for consistent title styling
 */
Card.Title = function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("text-lg font-medium leading-6 text-gray-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
};

/**
 * Card.Description component for consistent description styling
 */
Card.Description = function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={cn("mt-1 text-sm text-gray-500", className)}
      {...props}
    >
      {children}
    </p>
  );
};

/**
 * Card.Content component for content with default padding
 */
Card.Content = function CardContent({ className, children, ...props }) {
  return (
    <div
      className={cn("p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};
