'use client';

import { Calendar, Clock, CheckCircle2, Circle } from 'lucide-react';
import { DailySchedule as Schedule } from '@/lib/clawdbot';

interface Props {
  schedule: Schedule[];
}

export default function DailySchedule({ schedule }: Props) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'health': return 'bg-green-100 text-green-800 border-green-300';
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'check': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'reminder': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Daily Schedule</h2>
      </div>

      <div className="space-y-3">
        {schedule.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 border-l-4 border-blue-500 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-2 w-20">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-mono font-semibold text-gray-700">
                {item.time}
              </span>
            </div>

            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.task}</p>
            </div>

            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(item.type)}`}>
                {item.type}
              </span>
            </div>

            <div>
              {item.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
