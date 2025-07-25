
import React from 'react';

/**
 * Full-page loading spinner component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.message="Loading..."] - Loading message to display
 */
export default function LoadingPage({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="relative w-24 h-24 mb-8">
        {/* Spinner animation */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
      </div>

      {message && (
        <p className="text-lg text-gray-700 font-medium text-center">{message}</p>
      )}

      <p className="text-sm text-gray-500 mt-4 max-w-md text-center">
        This won't take long. We're preparing everything for you.
      </p>
    </div>
  );
}

/**
 * Content section loading spinner component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size="medium"] - Size of the spinner (small, medium, large)
 * @param {string} [props.message] - Optional loading message
 */
export function ContentLoader({ size = "medium", message }) {
  // Size classes
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-2",
    large: "w-12 h-12 border-3",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size] || sizeClasses.medium} border-gray-200 border-t-blue-600 rounded-full animate-spin mb-2`}></div>

      {message && (
        <p className="text-sm text-gray-500 mt-2">{message}</p>
      )}
    </div>
  );
}

/**
 * Inline loading spinner component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.color="blue"] - Color of the spinner (blue, gray, white)
 * @param {string} [props.size="small"] - Size of the spinner (tiny, small, medium)
 */
export function InlineLoader({ color = "blue", size = "small" }) {
  // Color classes
  const colorClasses = {
    blue: "border-blue-200 border-t-blue-600",
    gray: "border-gray-200 border-t-gray-600",
    white: "border-gray-100 border-t-white",
  };

  // Size classes
  const sizeClasses = {
    tiny: "w-3 h-3 border-1",
    small: "w-4 h-4 border-2",
    medium: "w-5 h-5 border-2",
  };

  return (
    <div 
      className={`inline-block rounded-full animate-spin ${colorClasses[color] || colorClasses.blue} ${sizeClasses[size] || sizeClasses.small}`}
    />
  );
}
