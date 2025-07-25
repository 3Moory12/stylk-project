
import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking window size
 * 
 * @param {Object} options - Hook options
 * @param {number} [options.debounceDelay=250] - Debounce delay in milliseconds
 * @returns {Object} Window size object containing width and height
 */
export function useWindowSize({
  debounceDelay = 250
} = {}) {
  // Initialize state with undefined to represent the window dimensions
  // We'll get the actual values after the first render
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    let timeoutId = null;

    function handleResize() {
      // Use debounce to avoid excessive updates
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceDelay);
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [debounceDelay]); // Empty array ensures that effect runs only on mount and unmount

  return windowSize;
}

/**
 * Custom hook to check if the current window size matches a media query
 * 
 * @param {string} query - CSS media query string
 * @returns {boolean} Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create a media query list
    const mediaQueryList = window.matchMedia(query);

    // Set the initial value
    setMatches(mediaQueryList.matches);

    // Define a callback function to handle changes
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // Add the callback as a listener
    mediaQueryList.addEventListener('change', handleChange);

    // Remove listener on cleanup
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Custom hook to check if the screen is a specific size using predefined breakpoints
 * 
 * @returns {Object} Object with boolean flags for each screen size
 */
export function useBreakpoint() {
  const sm = useMediaQuery('(min-width: 640px)');
  const md = useMediaQuery('(min-width: 768px)');
  const lg = useMediaQuery('(min-width: 1024px)');
  const xl = useMediaQuery('(min-width: 1280px)');
  const xxl = useMediaQuery('(min-width: 1536px)');

  return {
    isMobile: !sm,        // < 640px
    isTablet: sm && !lg,  // >= 640px && < 1024px
    isDesktop: lg,        // >= 1024px
    sm,                   // >= 640px
    md,                   // >= 768px
    lg,                   // >= 1024px
    xl,                   // >= 1280px
    xxl,                  // >= 1536px
  };
}
