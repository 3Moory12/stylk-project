
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import Card from '../molecules/Card';
import { useAuth } from '../../providers/AuthProvider';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {user?.name || 'User'}! Here's an overview of your account.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex flex-col items-center py-5">
            <div className="text-3xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-500 mt-1">Active Projects</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col items-center py-5">
            <div className="text-3xl font-bold text-green-600">85%</div>
            <div className="text-sm text-gray-500 mt-1">Tasks Completed</div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col items-center py-5">
            <div className="text-3xl font-bold text-purple-600">8</div>
            <div className="text-sm text-gray-500 mt-1">Notifications</div>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <Card>
          <ul className="divide-y divide-gray-200">
            <li className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    New project created
                  </p>
                  <p className="text-sm text-gray-500">
                    You created a new project "Website Redesign"
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  2 hours ago
                </div>
              </div>
            </li>
            <li className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 rounded-full p-2">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Task completed
                  </p>
                  <p className="text-sm text-gray-500">
                    You completed the task "Update dependencies"
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Yesterday
                </div>
              </div>
            </li>
            <li className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-yellow-100 rounded-full p-2">
                    <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Reminder
                  </p>
                  <p className="text-sm text-gray-500">
                    Team meeting scheduled for tomorrow at 10:00 AM
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  2 days ago
                </div>
              </div>
            </li>
          </ul>
          <div className="border-t border-gray-200 p-4 text-center">
            <Link to="#" className="text-sm text-blue-600 hover:text-blue-500">
              View all activity
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button fullWidth variant="outline">
            New Project
          </Button>
          <Button fullWidth variant="outline">
            Add Task
          </Button>
          <Button fullWidth variant="outline">
            Generate Report
          </Button>
          <Button fullWidth variant="outline">
            Invite Team
          </Button>
        </div>
      </div>
    </div>
  );
}
