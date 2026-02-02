'use client';

import { useEffect, useState } from 'react';
import { Clock, Calendar, Target, AlertTriangle } from 'lucide-react';

export default function RealTimeStatusBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nabhCountdown, setNabhCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // NABH Audit: Feb 13, 2026
      const nabhDate = new Date('2026-02-13T09:00:00+05:30');
      const diff = nabhDate.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setNabhCountdown({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-700 text-white p-4 rounded-lg shadow-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Time */}
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8" />
          <div>
            <p className="text-xs opacity-90">Current Time (IST)</p>
            <p className="text-2xl font-bold">{formatTime(currentTime)}</p>
            <p className="text-xs opacity-75">{formatDate(currentTime)}</p>
          </div>
        </div>

        {/* NABH Countdown */}
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 animate-pulse" />
          <div>
            <p className="text-xs opacity-90">NABH AUDIT COUNTDOWN</p>
            <p className="text-2xl font-bold">
              {nabhCountdown.days}d {nabhCountdown.hours}h {nabhCountdown.minutes}m
            </p>
            <p className="text-xs opacity-75">Feb 13-14, 2026 | Hope Hospital</p>
          </div>
        </div>

        {/* Mission Status */}
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8" />
          <div>
            <p className="text-xs opacity-90">CRITICAL MISSIONS</p>
            <p className="text-lg font-bold">4 Active</p>
            <p className="text-xs opacity-75">NABH • Occupancy • Revenue • ESIC</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-xs opacity-75">NABH Progress</p>
          <p className="text-xl font-bold">75%</p>
        </div>
        <div>
          <p className="text-xs opacity-75">Occupancy</p>
          <p className="text-xl font-bold">42/75</p>
        </div>
        <div>
          <p className="text-xs opacity-75">Revenue</p>
          <p className="text-xl font-bold">₹12L</p>
        </div>
        <div>
          <p className="text-xs opacity-75">ESIC</p>
          <p className="text-xl font-bold">₹35L</p>
        </div>
      </div>
    </div>
  );
}
