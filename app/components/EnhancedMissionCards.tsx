'use client';

import { Target, TrendingUp, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  deadline: string;
  daysLeft: number;
  priority: 'critical' | 'high' | 'medium';
  progress: number;
  current: string;
  target: string;
  icon: any;
  color: string;
  urgency: string;
  keyActions: string[];
}

export default function EnhancedMissionCards() {
  const missions: Mission[] = [
    {
      id: 'nabh',
      title: 'NABH Audit Success',
      deadline: 'Feb 13-14, 2026',
      daysLeft: 11,
      priority: 'critical',
      progress: 75,
      current: '77/102',
      target: '102 elements',
      icon: Target,
      color: 'red',
      urgency: 'CRITICAL - 11 DAYS',
      keyActions: [
        'Daily Isaac coordination',
        'Department head readiness',
        'Evidence documentation complete',
        'Staff training verification'
      ]
    },
    {
      id: 'occupancy',
      title: 'Hospital Occupancy',
      deadline: 'April 1, 2026',
      daysLeft: 58,
      priority: 'high',
      progress: 56,
      current: '42/75',
      target: '75 beds',
      icon: TrendingUp,
      color: 'blue',
      urgency: 'HIGH - 58 DAYS',
      keyActions: [
        'Ayushman: Daily tracking',
        'Hope: Post-NABH marketing',
        'Combined growth strategy',
        'Weekly trend analysis'
      ]
    },
    {
      id: 'revenue',
      title: 'Software Revenue',
      deadline: 'April 1, 2026',
      daysLeft: 58,
      priority: 'high',
      progress: 40,
      current: '₹12L/mo',
      target: '₹30L/month',
      icon: DollarSign,
      color: 'green',
      urgency: 'HIGH - 58 DAYS',
      keyActions: [
        'bettroi.com: 50+ projects',
        'DocDRM: Client pipeline',
        'nabh.online: Priority launch',
        'Payment collection focus'
      ]
    },
    {
      id: 'esic',
      title: 'ESIC Recovery',
      deadline: 'April 1, 2026',
      daysLeft: 58,
      priority: 'high',
      progress: 65,
      current: '₹35L',
      target: '₹1 Crore',
      icon: Clock,
      color: 'orange',
      urgency: 'HIGH - Cash Flow',
      keyActions: [
        'Dr. Shivkumar: Feb 10 approval',
        'Weekly 15-day follow-ups',
        'MPKAY: ₹38L pending',
        'Email escalations ready'
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      default: return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-600';
    if (progress >= 50) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {missions.map((mission) => {
        const Icon = mission.icon;
        return (
          <div
            key={mission.id}
            className={`border-2 rounded-lg p-6 hover:shadow-xl transition-all ${getPriorityColor(mission.priority)}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full bg-${mission.color}-200`}>
                  <Icon className={`w-6 h-6 text-${mission.color}-700`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{mission.title}</h3>
                  <p className="text-sm text-gray-600">{mission.deadline}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                mission.priority === 'critical' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
              }`}>
                {mission.urgency}
              </span>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Progress</span>
                <span className="text-sm font-bold text-gray-900">{mission.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${getProgressColor(mission.progress)}`}
                  style={{ width: `${mission.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">Current: {mission.current}</span>
                <span className="text-xs text-gray-600">Target: {mission.target}</span>
              </div>
            </div>

            {/* Key Actions */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700 mb-2">Key Actions:</p>
              {mission.keyActions.map((action, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-700">{action}</span>
                </div>
              ))}
            </div>

            {/* Days Left Indicator */}
            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Days Remaining</span>
                <span className={`text-lg font-bold ${
                  mission.daysLeft <= 15 ? 'text-red-600' : 'text-gray-800'
                }`}>
                  {mission.daysLeft} days
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
