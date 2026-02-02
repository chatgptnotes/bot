'use client';

import { Briefcase, ExternalLink, TrendingUp } from 'lucide-react';

export default function ProjectsOverview() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Projects Overview</h2>
      </div>

      <div className="space-y-4">
        <div className="border rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">bettroi.com</h3>
              <p className="text-sm text-gray-600">Software development projects</p>
            </div>
            <a
              href="https://bettroi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">50+</p>
              <p className="text-xs text-gray-600">Total Projects</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">--</p>
              <p className="text-xs text-gray-600">Active</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">--</p>
              <p className="text-xs text-gray-600">Pending Review</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Weekly rotation for follow-ups</span>
          </div>
        </div>

        <div className="border rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">DocDRM</h3>
              <p className="text-sm text-gray-600">Software company</p>
            </div>
            <a
              href="https://drmhope.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
          <p className="text-sm text-gray-600">
            Development tasks and company operations
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Follow-up schedule:</strong> ClawdBot will rotate through all 50+ bettroi.com projects weekly for status updates.
        </p>
      </div>
    </div>
  );
}
