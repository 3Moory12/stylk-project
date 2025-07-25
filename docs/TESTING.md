# Testing Strategy

## Overview

The Stylk Project follows a comprehensive testing approach to ensure high-quality, reliable code. We aim for at least 70% code coverage as mentioned in the stabilization phase of our development roadmap.

## Testing Levels

### Unit Testing (Jest)

Unit tests focus on testing individual components, functions, and modules in isolation.

**Key principles:**
- Test business logic thoroughly
- Mock external dependencies
- Focus on edge cases
- Keep tests simple and fast

**Example component test:**

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';

describe('Button component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled styling when disabled', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toHaveClass('opacity-50');
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Integration Testing (Jest + Testing Library)

Integration tests verify that different parts of the application work together correctly.

**Key areas:**
- Component interactions
- Form submissions
- API integration
- Routing

**Example integration test:**

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SentryProvider } from '../providers/SentryProvider';
import UserProfile from '../components/UserProfile';
import { useAppStore } from '../stores/appStore';

// Mock the API call
jest.mock('../api', () => ({
  updateUserProfile: jest.fn(() => Promise.resolve({ success: true })),
}));

describe('UserProfile integration', () => {
  it('updates user profile and shows success message', async () => {
    // Setup the store
    const { setUser } = useAppStore.getState();
    setUser({ id: '123', name: 'John' });

    render(
      <SentryProvider>
        <UserProfile />
      </SentryProvider>
    );

    // Fill the form
    fireEvent.change(screen.getByLabelText('Display Name'), {
      target: { value: 'John Doe' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Save Changes'));

    // Check loading state
    expect(screen.getByText('Saving...')).toBeInTheDocument();

    // Verify success message appears
    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
    });

    // Verify store was updated
    expect(useAppStore.getState().user.name).toBe('John Doe');
  });
});
```

### End-to-End Testing (Cypress)

E2E tests verify the application works correctly from a user's perspective, testing complete workflows.

**Key workflows to test:**
- User authentication
- Core business processes
- Critical user journeys

**Example Cypress test:**

```javascript
describe('Authentication Flow', () => {
  it('allows a user to sign in and access protected content', () => {
    // Visit the home page
    cy.visit('/');

    // Click on sign-in button
    cy.findByText('Sign In').click();

    // Fill in credentials
    cy.findByLabelText('Email').type('test@example.com');
    cy.findByLabelText('Password').type('securepassword');

    // Submit the form
    cy.findByText('Sign In').click();

    // Verify redirection to dashboard
    cy.url().should('include', '/dashboard');

    // Verify authenticated content is visible
    cy.findByText('Welcome back').should('be.visible');

    // Verify localStorage has the token
    cy.window().then((window) => {
      const appStorage = JSON.parse(window.localStorage.getItem('app-storage'));
      expect(appStorage.user).to.not.be.null;
    });
  });
});
```

## Test Organization

Tests should be organized as follows:

```
src/
├── components/
│   ├── Button.jsx
│   └── Button.test.jsx
├── hooks/
│   ├── useCleanup.js
│   └── useCleanup.test.js
├── utils/
│   ├── logger.js
│   └── logger.test.js
tests/
├── integration/
│   └── authentication.test.js
└── e2e/
    └── userJourneys.spec.js
```

## Test Coverage

We use Jest's built-in coverage reporter to track test coverage:

```bash
npm run test -- --coverage
```

Coverage thresholds are configured in `jest.config.js`:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Testing Best Practices

1. **Write tests first** when possible (TDD approach)
2. **Keep tests independent** - don't rely on execution order
3. **Use meaningful assertions** that clearly express intent
4. **Mock external dependencies** but not the code under test
5. **Use test data factories** to generate consistent test data
6. **Focus on behavior, not implementation** - test what the code does, not how it does it

## Continuous Integration

All tests run automatically on GitHub Actions:
- Unit and integration tests run on all PRs and pushes to main
- E2E tests run on pushes to main and release branches
- Test coverage reports are uploaded to Codecov

## Performance Testing

Performance is measured through:

1. **Lighthouse CI** - integrated into the CI pipeline
2. **Web Vitals** - collected in production
3. **Load testing** - using k6 for API endpoints
