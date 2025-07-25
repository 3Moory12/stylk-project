
/**
 * Utility for conditionally joining class names
 * Uses tailwind-merge to handle Tailwind CSS class conflicts
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and resolves Tailwind CSS conflicts
 * 
 * @param {...string|Object|Array|boolean} inputs - Class names to merge
 * @returns {string} - Merged class string
 * 
 * @example
 * // Returns "font-bold text-blue-500"
 * cn('font-bold', null, false, 'text-blue-500', undefined);
 * 
 * @example
 * // Returns "p-4 bg-blue-500" (bg-blue-500 overrides bg-red-500)
 * cn('p-4 bg-red-500', 'bg-blue-500');
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
