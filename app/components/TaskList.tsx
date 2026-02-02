'use client';

import { CheckSquare, Square, Folder } from 'lucide-react';
import { Task } from '@/lib/clawdbot';

interface Props {
  tasks: Task[];
}

export default function TaskList({ tasks }: Props) {
  const categories = Array.from(new Set(tasks.map(t => t.category)));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Active Tasks</h2>
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const categoryTasks = tasks.filter(t => t.category === category);
          const completed = categoryTasks.filter(t => t.completed).length;
          const total = categoryTasks.length;

          return (
            <div key={category} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Folder className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{category}</h3>
                </div>
                <span className="text-sm text-gray-600">
                  {completed}/{total} completed
                </span>
              </div>

              <div className="space-y-2">
                {categoryTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
