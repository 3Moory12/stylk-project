
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Custom hook for handling pagination
 * 
 * @param {Object} options - Pagination options
 * @param {number} [options.initialPage=1] - Initial page number
 * @param {number} [options.initialPageSize=10] - Initial page size
 * @param {Array} [options.pageSizeOptions=[10, 20, 50, 100]] - Available page size options
 * @param {number} [options.totalItems=0] - Total number of items
 * @param {boolean} [options.syncWithUrl=false] - Whether to sync pagination state with URL params
 * @returns {Object} Pagination state and handlers
 */
export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  totalItems = 0,
  syncWithUrl = false,
} = {}) {
  // Get URL search params if syncing with URL
  const [searchParams, setSearchParams] = syncWithUrl ? useSearchParams() : [null, null];

  // Initialize state from URL params if available
  const initialState = useMemo(() => {
    if (syncWithUrl && searchParams) {
      return {
        page: parseInt(searchParams.get('page') || initialPage, 10),
        pageSize: parseInt(searchParams.get('pageSize') || initialPageSize, 10),
      };
    }
    return { page: initialPage, pageSize: initialPageSize };
  }, [initialPage, initialPageSize, searchParams, syncWithUrl]);

  // State for current page and page size
  const [page, setPage] = useState(initialState.page);
  const [pageSize, setPageSize] = useState(initialState.pageSize);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  // Ensure page is within valid range
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // Sync with URL if enabled
  useEffect(() => {
    if (syncWithUrl && setSearchParams) {
      setSearchParams(prev => {
        // Create a new URLSearchParams object to avoid mutating the original
        const newParams = new URLSearchParams(prev);

        // Update pagination params
        newParams.set('page', page.toString());
        newParams.set('pageSize', pageSize.toString());

        return newParams;
      });
    }
  }, [page, pageSize, syncWithUrl, setSearchParams]);

  // Calculate items for current page
  const getPageItems = useCallback((items) => {
    if (!items || !items.length) return [];

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return items.slice(startIndex, endIndex);
  }, [page, pageSize]);

  // Navigate to a specific page
  const goToPage = useCallback((newPage) => {
    const targetPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(targetPage);
  }, [totalPages]);

  // Go to next page
  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  }, [page, totalPages]);

  // Go to previous page
  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  // Go to first page
  const firstPage = useCallback(() => {
    setPage(1);
  }, []);

  // Go to last page
  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages]);

  // Change page size
  const changePageSize = useCallback((newSize) => {
    // Calculate the first item index on the current page
    const firstItemIndex = (page - 1) * pageSize;

    // Set the new page size
    setPageSize(newSize);

    // Adjust the page to keep the same starting item in view
    const newPage = Math.floor(firstItemIndex / newSize) + 1;
    setPage(newPage);
  }, [page, pageSize]);

  // Calculate page info
  const pageInfo = useMemo(() => {
    const startItem = Math.min(totalItems, (page - 1) * pageSize + 1);
    const endItem = Math.min(totalItems, page * pageSize);

    return {
      startItem,
      endItem,
      totalItems,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }, [page, pageSize, totalItems, totalPages]);

  // Generate pagination range
  const paginationRange = useMemo(() => {
    const maxVisiblePages = 5;
    const range = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few enough
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Always show first and last page
      range.push(1);

      // Calculate the range around the current page
      const leftSide = Math.floor(maxVisiblePages / 2);
      const rightSide = maxVisiblePages - leftSide - 1;

      // Calculate start and end page
      let startPage = Math.max(2, page - leftSide);
      let endPage = Math.min(totalPages - 1, page + rightSide);

      // Adjust if the range is too small on either side
      if (startPage <= 2) {
        endPage = Math.min(totalPages - 1, 1 + maxVisiblePages - 1);
      }

      if (endPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - maxVisiblePages + 1);
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        range.push('...');
      }

      // Add pages in the middle
      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        range.push('...');
      }

      // Add last page if it's not already added
      if (totalPages > 1) {
        range.push(totalPages);
      }
    }

    return range;
  }, [page, totalPages]);

  return {
    // State
    page,
    pageSize,
    totalPages,
    pageInfo,
    paginationRange,
    pageSizeOptions,

    // Actions
    setPage: goToPage,
    setPageSize: changePageSize,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    goToPage,
    changePageSize,

    // Helpers
    getPageItems,
  };
}
