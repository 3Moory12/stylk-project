# Stylk Project

A modern React application built with best practices for performance, stability, and scalability.

## Features

- ⚡️ **Vite & React 19** - Latest React with Vite for lightning-fast development
- 🎨 **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- 🧪 **Jest & Cypress** - Comprehensive testing suite for unit and E2E testing
- 📊 **Sentry Monitoring** - Error tracking and performance monitoring
- 🔄 **Zustand** - Lightweight state management with minimal boilerplate
- 🚀 **CI/CD Pipeline** - Automated testing, building and deployment
- 📱 **Responsive Design** - Mobile-first approach for all screen sizes

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/stylk-project.git
cd stylk-project

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run Jest tests with coverage
- `npm run test:watch` - Run Jest tests in watch mode
- `npm run cypress:open` - Open Cypress test runner
- `npm run cypress:run` - Run Cypress tests headlessly
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run analyze` - Analyze bundle size

## Architecture

The project follows a modular architecture with clear separation of concerns:

- `/src/components` - Reusable UI components
- `/src/hooks` - Custom React hooks
- `/src/stores` - State management with Zustand
- `/src/providers` - Context providers (Sentry, Theme, etc.)
- `/src/utils` - Utility functions and helpers
- `/src/assets` - Static assets (images, fonts, etc.)

## Development Workflow

1. Create feature branches from `main`
2. Submit PRs with descriptive titles and details
3. CI runs tests and builds automatically
4. Code review by at least one team member
5. Merge to `main` after approval

## Performance Optimization

- Code splitting with dynamic imports
- Component lazy loading
- Memoization of expensive calculations
- Optimized asset loading and bundling
- Web Vitals monitoring

## Documentation

Additional documentation:

- [API Documentation](/docs/API.md)
- [Component Library](/docs/COMPONENTS.md)
- [State Management](/docs/STATE.md)
- [Testing Strategy](/docs/TESTING.md)

## License

[MIT](LICENSE)
