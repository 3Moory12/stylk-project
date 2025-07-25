# Component Library

## Overview

The Stylk Project uses a component-driven architecture, with reusable components built using React, Tailwind CSS, and TypeScript. This document outlines the component structure, usage guidelines, and best practices.

## Component Organization

Components are organized in a hierarchical structure:

```
src/
└── components/
    ├── atoms/       # Smallest building blocks (Button, Input, Icon)
    ├── molecules/   # Combinations of atoms (FormField, Card)
    ├── organisms/   # Complex components (NavBar, DataTable)
    ├── templates/   # Page layouts and structures
    └── pages/       # Full page components
```

## Core Components

### Design System Components

These base components implement our design system and should be used throughout the application for consistency.

#### Button

```jsx
import Button from '../components/atoms/Button';

<Button 
  variant="primary" // primary, secondary, outline, ghost
  size="md"         // sm, md, lg
  isLoading={false}
  disabled={false}
  onClick={() => {}}
>
  Click Me
</Button>
```

#### Input

```jsx
import Input from '../components/atoms/Input';

<Input 
  type="text"     // text, email, password, etc.
  label="Email"
  error="Invalid email format"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
```

#### Card

```jsx
import Card from '../components/molecules/Card';

<Card 
  title="Feature Name"
  footer={<Button>Learn More</Button>}
>
  <p>Card content goes here...</p>
</Card>
```

### Layout Components

#### Container

```jsx
import Container from '../components/layout/Container';

<Container size="md"> // sm, md, lg, xl, full
  <h1>Page Content</h1>
  <p>More content...</p>
</Container>
```

#### Grid

```jsx
import { Grid, GridItem } from '../components/layout/Grid';

<Grid cols={12} gap={4}>
  <GridItem colSpan={[12, 6, 4]}> {/* responsive: mobile, tablet, desktop */}
    <Card title="Item 1" />
  </GridItem>
  <GridItem colSpan={[12, 6, 4]}>
    <Card title="Item 2" />
  </GridItem>
  <GridItem colSpan={[12, 12, 4]}>
    <Card title="Item 3" />
  </GridItem>
</Grid>
```

## Component Guidelines

### Creating New Components

When creating a new component:

1. **Consider reusability** - Can this be more generic?
2. **Use TypeScript** - Define proper props interfaces
3. **Add documentation** - Include JSDoc comments
4. **Write tests** - At minimum, test rendering and key interactions
5. **Consider accessibility** - Ensure keyboard navigation, screen reader support

### Example Component Structure

```jsx
import React from 'react';
import { cn } from '../../utils/cn';
import { useCleanup } from '../../hooks/useCleanup';

/**
 * Alert component displays important messages to the user
 */
export interface AlertProps {
  /** The severity level of the alert */
  variant?: 'info' | 'success' | 'warning' | 'error';
  /** The main content of the alert */
  children: React.ReactNode;
  /** Optional title for the alert */
  title?: string;
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Callback when the alert is dismissed */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  children,
  title,
  dismissible = false,
  onDismiss,
  className,
}) => {
  // Map variant to styles
  const variantStyles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  // Handle escape key for dismissible alerts
  useCleanup(
    null,
    [dismissible, onDismiss],
    () => {
      if (!dismissible || !onDismiss) return;

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onDismiss();
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  );

  return (
    <div
      role="alert"
      className={cn(
        'p-4 rounded border',
        variantStyles[variant],
        className
      )}
    >
      {title && <h4 className="font-semibold mb-1">{title}</h4>}
      <div>{children}</div>
      {dismissible && (
        <button
          type="button"
          aria-label="Close"
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1"
        >
          &times;
        </button>
      )}
    </div>
  );
};
```

## Theming and Styling

Components use Tailwind CSS with custom theme extensions:

- Theme colors are defined in `tailwind.config.js`
- Utility classes are preferred over custom CSS
- CSS Modules are used for complex components
- Dark mode is supported via a `dark` class on the `<html>` element

## Accessibility

All components should follow WCAG 2.1 AA standards:

- Proper semantic HTML
- ARIA attributes where needed
- Keyboard navigation
- Color contrast compliance
- Focus management

## Performance Considerations

- Use `React.memo()` for components that render frequently
- Avoid unnecessary re-renders with proper dependency arrays
- Lazy load components that aren't needed on initial render
- Use the performance profiler to identify bottlenecks
