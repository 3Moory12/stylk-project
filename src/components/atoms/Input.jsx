
import React, { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/**
 * Input variants
 */
const inputVariants = cva(
  // Base styles
  "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      // Input size
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-3",
        lg: "h-12 px-4 text-base",
      },
      // Input state
      state: {
        default: "border-gray-300",
        error: "border-red-500 focus-visible:ring-red-500 text-red-900 placeholder:text-red-400",
        success: "border-green-500 focus-visible:ring-green-500",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
);

/**
 * Input component with forwarded ref
 */
const Input = forwardRef(
  /**
   * @param {Object} props - Component props
   * @param {string} [props.size] - Input size (sm, md, lg)
   * @param {string} [props.state] - Input state (default, error, success)
   * @param {string} [props.label] - Input label
   * @param {string} [props.error] - Error message
   * @param {string} [props.className] - Additional CSS classes
   * @param {React.Ref} ref - Forwarded ref
   */
  ({ size, state, label, error, className, id, ...props }, ref) => {
    // Generate a unique ID if none is provided
    const inputId = id || React.useId();

    // Determine state based on error prop
    const inputState = error ? "error" : state;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input element */}
        <input
          id={inputId}
          className={cn(inputVariants({ size, state: inputState }), className)}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />

        {/* Error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

// Display name for debugging
Input.displayName = "Input";

export default Input;
