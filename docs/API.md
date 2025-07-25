# API Documentation

## Overview

This document outlines the APIs used in the Stylk Project, including both internal hooks/utilities and external service integrations.

## Internal APIs

### State Management

The application uses Zustand for state management. The main store is defined in `src/stores/appStore.js`.

```javascript
import { useAppStore, useIsLoading, useError, useUser, useTheme } from '../stores/appStore';

// Using the full store
const { setLoading, setError, setUser } = useAppStore();

// Using individual selectors (recommended for better performance)
const isLoading = useIsLoading();
const error = useError();
const user = useUser();
const theme = useTheme();
```

### Custom Hooks

#### Memory Management Hooks

To prevent memory leaks, use the cleanup hooks from `src/hooks/useCleanup.js`:

```javascript
import { useCleanup, useEventListener, useInterval, useAsyncEffect } from '../hooks/useCleanup';

// Managing general cleanup
useCleanup(
  () => { /* Cleanup function */ },
  [dependency1, dependency2],
  () => { /* Setup function */ }
);

// Managing event listeners
useEventListener('resize', handleResize, window);

// Managing intervals
useInterval(fetchData, 5000);

// Managing async effects
useAsyncEffect(async (isActive) => {
  const data = await fetchData();
  if (isActive.current) {
    setData(data);
  }
}, [dependency]);
```

### Logging

Centralized logging system from `src/utils/logger.js`:

```javascript
import { logger, LogLevel } from '../utils/logger';

logger.debug('Debug message', { additionalData: 'value' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', { errorCode: 500 });
logger.performance('Operation Name', durationMs);
```

## External APIs

### Sentry Integration

Error tracking and performance monitoring is handled through Sentry:

```javascript
import * as Sentry from '@sentry/react';

// Manually capture errors
Sentry.captureException(error);

// Manually capture messages
Sentry.captureMessage('Something happened', {
  level: Severity.Warning,
});

// Performance monitoring
const transaction = Sentry.startTransaction({ name: 'MyTransaction' });
// ... do something ...
transaction.finish();
```

## API Best Practices

1. **Error Handling**: Always wrap API calls in try/catch blocks and use the logger for errors.
2. **Loading States**: Use the global loading state for significant operations.
3. **Cancellation**: For async operations that might be interrupted, use AbortController.
4. **Caching**: Consider using React Query for data fetching with automatic caching.
5. **Retry Logic**: Implement exponential backoff for retrying failed requests.

## Future Expansions

Planned API enhancements:

1. REST API client with automatic error handling
2. GraphQL integration with Apollo Client
3. WebSocket connection for real-time updates
4. Offline-first capabilities with IndexedDB
