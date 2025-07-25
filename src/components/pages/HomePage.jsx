
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import Card from '../molecules/Card';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to the Stylk Project
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A modern web application with React, Tailwind CSS, and best practices for security and performance.
        </p>
      </div>

      {/* Features section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Title>Performance Optimized</Card.Title>
          <Card.Description>
            Built with code splitting, lazy loading, and web vitals monitoring.
          </Card.Description>
          <div className="mt-4">
            <Link to="/about">
              <Button variant="outline" size="sm">Learn More</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <Card.Title>Security First</Card.Title>
          <Card.Description>
            Implements best practices for web security, including Helmet.js and secure headers.
          </Card.Description>
          <div className="mt-4">
            <Link to="/about">
              <Button variant="outline" size="sm">Learn More</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <Card.Title>Component Library</Card.Title>
          <Card.Description>
            Reusable UI components built with Tailwind CSS and modern React patterns.
          </Card.Description>
          <div className="mt-4">
            <Link to="/about">
              <Button variant="outline" size="sm">Learn More</Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* CTA section */}
      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          Ready to get started?
        </h2>
        <p className="text-blue-600 mb-6">
          Create your account now and start exploring.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
