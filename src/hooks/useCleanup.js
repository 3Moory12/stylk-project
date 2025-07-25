
import { useEffect, useRef } from 'react';
import { logger } from '../utils/logger';

/**
 * A custom hook to manage cleanup of resources to prevent memory leaks.
 * Particularly useful for handling subscriptions, timers, and event listeners.
 * 
 * @param {Function} cleanupFn - Function to run on component unmount
 * @param {Array} deps - Dependencies that should trigger cleanup/re-setup
 * @param {Function} setupFn - Optional function to run on mount/deps change
 * @returns {Object} - Object containing the cleanup reference
 */
export function useCleanup(cleanupFn, deps = [], setupFn = null) {
  const cleanupRef = useRef(null);

  useEffect(() => {
    // Run setup function if provided and store any returned cleanup function
    if (setupFn) {
      try {
        const result = setupFn();

        // If setup returns a function, store it for cleanup
        if (typeof result === 'function') {
          cleanupRef.current = result;
        }
      } catch (error) {
        logger.error('Error in setup function', { error });
      }
    }

    // Return cleanup function
    return () => {
      try {
        // Run the specific cleanup function if provided
        if (cleanupFn) {
          cleanupFn();
        }

        // Run any cleanup returned by the setup function
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
      } catch (error) {
        logger.error('Error in cleanup function', { error });
      }
    };
  }, deps);

  return { cleanupRef };
}

/**
 * Specialized hook for managing event listeners safely
 */
export function useEventListener(eventName, handler, element = window, options = {}) {
  const savedHandler = useRef();

  // Update ref when handler changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useCleanup(
    // Cleanup function
    () => {
      element?.removeEventListener(eventName, savedHandler.current);
    },
    // Dependencies
    [eventName, element],
    // Setup function
    () => {
      if (!element?.addEventListener) return;
      const eventListener = (event) => savedHandler.current(event);
      element.addEventListener(eventName, eventListener, options);
      return () => element.removeEventListener(eventName, eventListener);
    }
  );
}

/**
 * Specialized hook for managing intervals safely
 */
export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useCleanup(
    null,
    [delay],
    () => {
      if (delay !== null) {
        const id = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(id);
      }
    }
  );
}

/**
 * Specialized hook for handling async effects safely
 */
export function useAsyncEffect(effectFn, deps = []) {
  useEffect(() => {
    const isActive = { current: true };

    const runEffect = async () => {
      try {
        await effectFn(isActive);
      } catch (error) {
        if (isActive.current) {
          logger.error('Error in async effect', { error });
        }
      }
    };

    runEffect();

    return () => {
      isActive.current = false;
    };
  }, deps);
}
