# State Management

## Overview

The Stylk Project uses Zustand for state management, providing a simple, fast, and scalable solution with minimal boilerplate. This document outlines our state management architecture, patterns, and best practices.

## Architecture

### Core Principles

1. **Minimal and Focused Stores**: Create small, purpose-specific stores rather than one global store
2. **Selector Optimization**: Use selector hooks to prevent unnecessary re-renders
3. **Middleware Stack**: Apply middleware for common concerns (persistence, logging, etc.)
4. **TypeScript Integration**: Leverage TypeScript for type safety

## Store Structure

### App Store

The main application store (`src/stores/appStore.js`) manages global UI state:

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the store
export const useAppStore = create(
  persist(
    (set) => ({
      // State
      isLoading: false,
      error: null,
      user: { id: null, name: null },
      theme: 'light',

      // Actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: { id: null, name: null } }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ user: state.user, theme: state.theme }),
    }
  )
);

// Export individual selectors
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
export const useUser = () => useAppStore((state) => state.user);
export const useTheme = () => useAppStore((state) => state.theme);
```

### Feature Stores

For more complex features, create dedicated stores:

```javascript
// src/stores/todoStore.js
import { create } from 'zustand';

export const useTodoStore = create((set) => ({
  // State
  todos: [],
  filter: 'all',

  // Computed state (getters)
  get filteredTodos() {
    const { todos, filter } = useTodoStore.getState();
    if (filter === 'completed') return todos.filter(t => t.completed);
    if (filter === 'active') return todos.filter(t => !t.completed);
    return todos;
  },

  // Actions
  addTodo: (text) => set((state) => ({ 
    todos: [...state.todos, { id: Date.now(), text, completed: false }]
  })),

  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),

  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter(todo => todo.id !== id)
  })),

  setFilter: (filter) => set({ filter }),
}));

// Export selectors
export const useTodos = () => useTodoStore((state) => state.todos);
export const useFilteredTodos = () => useTodoStore((state) => state.filteredTodos);
```

## Custom Middleware

### Logging Middleware

```javascript
const log = (config) => (set, get, api) => config(
  (...args) => {
    const prevState = get();
    set(...args);
    const nextState = get();
    console.log('State updated:', {
      prev: prevState,
      next: nextState,
      action: args[1]?.type || 'unknown'
    });
  },
  get,
  api
);

// Usage
export const useStore = create(log((set) => ({ /* ... */ })));
```

### Immer Middleware

For easier immutable updates:

```javascript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useStore = create(immer((set) => ({
  nested: { structure: { value: 0 } },
  increment: () => set((state) => {
    // Direct mutation with Immer
    state.nested.structure.value += 1;
  }),
})));
```

## State Management Best Practices

### Selector Patterns

Use selectors to extract only the data you need:

```javascript
// ❌ BAD: Gets the entire store, causes re-renders on any state change
function Component() {
  const state = useAppStore();
  return <div>{state.user.name}</div>;
}

// ✅ GOOD: Gets only what's needed, re-renders only when user.name changes
function Component() {
  const userName = useAppStore((state) => state.user.name);
  return <div>{userName}</div>;
}

// ✅ BETTER: Use pre-defined selector hooks
function Component() {
  const user = useUser();
  return <div>{user.name}</div>;
}
```

### Handling Async Actions

For async operations with loading and error states:

```javascript
// In the store
fetchUser: (id) => {
  set({ isLoading: true, error: null });

  fetch(`/api/users/${id}`)
    .then(res => res.json())
    .then(user => {
      set({ user, isLoading: false });
    })
    .catch(error => {
      set({ error: error.message, isLoading: false });
    });
}

// Better with async/await pattern
fetchUser: async (id) => {
  try {
    set({ isLoading: true, error: null });
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    set({ user, isLoading: false });
  } catch (error) {
    set({ error: error.message, isLoading: false });
  }
}
```

### Integrating with React Query

For complex data fetching needs, combine Zustand with React Query:

```javascript
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { create } from 'zustand';

// Create a queryClient instance
export const queryClient = new QueryClient();

// Create Zustand store for UI state only
export const useUiStore = create((set) => ({
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

// Use React Query for data fetching
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json()),
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: (userData) => 
      fetch(`/api/users/${userData.id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

## DevTools

Enable Redux DevTools integration for debugging:

```javascript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useStore = create(devtools((set) => ({
  // State and actions
}), { name: 'MyStore' }));
```

## State Organization Tips

1. **Group Related State**: Keep related state and actions together
2. **Use Comments**: Document the purpose of each state property and action
3. **Consider Normalization**: For relational data, normalize the state structure
4. **Avoid Redundant State**: Don't duplicate state that can be derived
5. **Be Mindful of Object Identity**: Create new objects to trigger re-renders
