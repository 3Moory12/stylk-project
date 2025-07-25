
import React, { Suspense } from 'react';

/**
 * Helper for lazy loading components with proper typing
 * @param {Function} importFn - Import function
 * @returns {Object} Component and named exports
 */
export function lazyImport(importFn) {
  const LazyComponent = React.lazy(importFn);

  return {
    // Default export as Component
    Component: (props) => (
      <Suspense fallback={<LazyFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    ),

    // Named exports
    ...Object.fromEntries(
      Object.keys(importFn).map((key) => [
        key,
        React.lazy(async () => {
          const module = await importFn();
          return { default: module[key] };
        }),
      ])
    ),
  };
}

/**
 * Default fallback component for lazy loaded components
 */
export function LazyFallback() {
  return (
    <div className="flex items-center justify-center p-4 h-full w-full min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

/**
 * HOC to lazy load a page component with fallback
 * @param {Function} importFn - Import function for the page
 * @returns {React.Component} Lazy loaded page with fallback
 */
export function lazyPage(importFn) {
  const LazyComponent = React.lazy(importFn);

  return (props) => (
    <Suspense fallback={<PageFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Fallback for page loading
 */
function PageFallback() {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading page...</p>
      </div>
    </div>
  );
}
