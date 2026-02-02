'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Clock, Users, MessageSquare, AlertCircle, Phone } from 'lucide-react';

interface Notification {
  id: string;
  type: 'reminder' | 'meeting' | 'urgent' | 'contact';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  icon: any;
  actionRequired?: boolean;
}

export default function SmartNotificationPanel() {
  const [showPanel, setShowPanel] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Generate time-based notifications
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const timeBasedNotifications: Notification[] = [];

    // Medicine Reminder (7:00 AM)
    if (currentHour === 7 && currentMinute < 30) {
      timeBasedNotifications.push({
        id: 'medicine-7am',
        type: 'reminder',
        title: '⏰ Medicine Time!',
        message: 'Time to take your morning medications',
        time: '7:00 AM',
        priority: 'high',
        icon: AlertCircle,
        actionRequired: true
      });
    }

    // 11 AM Meeting Reminder
    if (currentHour === 10 && currentMinute >= 45) {
      timeBasedNotifications.push({
        id: 'meeting-11am',
        type: 'meeting',
        title: '📅 Meeting in 15 minutes',
        message: 'SOP Hope, Ayush, Raftaar group - Directors chamber + Zoom',
        time: '11:00 AM',
        priority: 'high',
        icon: Users,
        actionRequired: true
      });
    }

    // 4 PM Meeting Reminder
    if (currentHour === 15 && currentMinute >= 45) {
      timeBasedNotifications.push({
        id: 'meeting-4pm',
        type: 'meeting',
        title: '📅 Meeting in 15 minutes',
        message: 'SOP Hope, Ayush, Raftaar group - Directors chamber + Zoom',
        time: '4:00 PM',
        priority: 'high',
        icon: Users,
        actionRequired: true
      });
    }

    // NABH Daily Coordination (8:30 AM)
    if (currentHour === 8 && currentMinute >= 30) {
      timeBasedNotifications.push({
        id: 'nabh-daily',
        type: 'urgent',
        title: '🚨 NABH Daily Coordination',
        message: 'Isaac coordination time - "Nabh with isaac" WhatsApp group',
        time: '8:30 AM',
        priority: 'high',
        icon: MessageSquare,
        actionRequired: true
      });
    }

    // Add important contacts notification
    timeBasedNotifications.push({
      id: 'contacts',
      type: 'contact',
      title: '📞 Key Contacts',
      message: 'Gaurav: +91 98222 02396 | Isaac: +91 72765 10845 | Sohail: +91 79720 96556',
      time: 'Always Available',
      priority: 'medium',
      icon: Phone,
      actionRequired: false
    });

    setNotifications(timeBasedNotifications);
    setUnreadCount(timeBasedNotifications.filter(n => n.actionRequired).length);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500 bg-red-50';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
      default: return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return AlertCircle;
      case 'meeting': return Users;
      case 'urgent': return MessageSquare;
      case 'contact': return Phone;
      default: return Bell;
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="absolute right-0 top-16 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-bold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-xs px-2 py-1 rounded-full">{unreadCount}</span>
              )}
            </div>
            <button
              onClick={() => setShowPanel(false)}
              className="hover:bg-white/20 rounded p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[500px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition ${getPriorityColor(notification.priority)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          notification.priority === 'high' ? 'bg-red-200' : 'bg-blue-200'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            notification.priority === 'high' ? 'text-red-700' : 'text-blue-700'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {notification.title}
                            </h4>
                            <button
                              onClick={() => dismissNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {notification.time}
                            </span>
                            {notification.actionRequired && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                Action Required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => setNotifications([])}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
