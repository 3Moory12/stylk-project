
import React from 'react';
import Card from '../molecules/Card';

export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">About Stylk Project</h1>
        <p className="text-lg text-gray-600 mt-2">
          Learn about our approach to building a modern, secure, and performant web application.
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Our Approach</h2>
          <p className="text-gray-600 mb-4">
            The Stylk Project is built with modern web development best practices in mind. 
            We focus on creating a fast, secure, and maintainable codebase that delivers an 
            excellent user experience.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Key Features</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Modern React with functional components and hooks</li>
            <li>Global state management with Zustand</li>
            <li>Type-safe development with JSDoc or TypeScript</li>
            <li>Component-driven UI development</li>
            <li>Responsive design with Tailwind CSS</li>
            <li>Comprehensive security measures</li>
          </ul>
        </div>

        <div>
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Technical Stack</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Frontend</h4>
                <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <li className="bg-blue-50 rounded px-3 py-1">React</li>
                  <li className="bg-blue-50 rounded px-3 py-1">React Router</li>
                  <li className="bg-blue-50 rounded px-3 py-1">Zustand</li>
                  <li className="bg-blue-50 rounded px-3 py-1">Tailwind CSS</li>
                  <li className="bg-blue-50 rounded px-3 py-1">Vite</li>
                  <li className="bg-blue-50 rounded px-3 py-1">Web Vitals</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-700">Security</h4>
                <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <li className="bg-green-50 rounded px-3 py-1">Helmet.js</li>
                  <li className="bg-green-50 rounded px-3 py-1">CSP Headers</li>
                  <li className="bg-green-50 rounded px-3 py-1">Rate Limiting</li>
                  <li className="bg-green-50 rounded px-3 py-1">Input Validation</li>
                  <li className="bg-green-50 rounded px-3 py-1">CORS</li>
                  <li className="bg-green-50 rounded px-3 py-1">Secure Authentication</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-700">Performance</h4>
                <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <li className="bg-yellow-50 rounded px-3 py-1">Code Splitting</li>
                  <li className="bg-yellow-50 rounded px-3 py-1">Lazy Loading</li>
                  <li className="bg-yellow-50 rounded px-3 py-1">Asset Optimization</li>
                  <li className="bg-yellow-50 rounded px-3 py-1">Caching</li>
                  <li className="bg-yellow-50 rounded px-3 py-1">Memoization</li>
                  <li className="bg-yellow-50 rounded px-3 py-1">Web Vitals Monitoring</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Development Timeline</h2>

        <div className="border-l-2 border-blue-500 pl-6 space-y-6">
          <div>
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-full w-4 h-4 absolute -ml-8"></div>
              <h3 className="text-lg font-semibold">Phase 1: Foundation</h3>
            </div>
            <p className="text-gray-600 mt-2">
              Project setup, component library, theming, and basic structure.
            </p>
          </div>

          <div>
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-full w-4 h-4 absolute -ml-8"></div>
              <h3 className="text-lg font-semibold">Phase 2: Core Features</h3>
            </div>
            <p className="text-gray-600 mt-2">
              Authentication, API integration, state management, and routing.
            </p>
          </div>

          <div>
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-full w-4 h-4 absolute -ml-8"></div>
              <h3 className="text-lg font-semibold">Phase 3: Performance & Security</h3>
            </div>
            <p className="text-gray-600 mt-2">
              Code splitting, security hardening, monitoring, and optimization.
            </p>
          </div>

          <div>
            <div className="flex items-center">
              <div className="bg-gray-300 rounded-full w-4 h-4 absolute -ml-8"></div>
              <h3 className="text-lg font-semibold">Phase 4: Advanced Features</h3>
            </div>
            <p className="text-gray-600 mt-2">
              Data visualization, offline support, and internationalization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
