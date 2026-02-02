'use client';

import { Activity } from 'lucide-react';

export default function DashboardHeader() {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8" />
            <h1 className="text-3xl font-bold">OpenClaw Dashboard</h1>
          </div>
          <p className="text-blue-100">Dr. Murali BK - AI-Powered Task Management</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">{currentTime}</div>
          <div className="text-blue-100">{currentDate}</div>
        </div>
      </div>
    </div>
  );
}
