'use client';

import { Bell, Clock } from 'lucide-react';
import { CronJob } from '@/lib/clawdbot';

interface Props {
  cronJobs: CronJob[];
}

export default function CronJobs({ cronJobs }: Props) {
  const formatSchedule = (schedule: any) => {
    if (!schedule || typeof schedule !== 'string') {
      return 'Not scheduled';
    }
    const parts = schedule.split(' ');
    if (parts.length === 5) {
      const [min, hour] = parts;
      return `${hour.padStart(2, '0')}:${min.padStart(2, '0')} daily`;
    }
    return schedule;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Automated Reminders</h2>
      </div>

      <div className="space-y-3">
        {cronJobs.map((job) => (
          <div
            key={job.id}
            className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition"
          >
            <div className="bg-blue-100 rounded-full p-2">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{job.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {job.action?.message || job.action?.prompt || 'Automated task'}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatSchedule(job.schedule)}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {job.action?.channel || 'System'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
