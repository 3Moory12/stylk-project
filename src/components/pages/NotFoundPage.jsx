
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>

        <div className="mt-4">
          <h2 className="text-3xl font-bold text-gray-900">Page not found</h2>
          <p className="mt-3 text-xl text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <div className="mt-10">
          <div className="text-gray-600 mb-6">
            Here are some helpful links instead:
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button>Home</Button>
            </Link>
            <Link to="/about">
              <Button variant="outline">About</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
