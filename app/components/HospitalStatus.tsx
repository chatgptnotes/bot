'use client';

import { Building2, Bed, TrendingUp } from 'lucide-react';

export default function HospitalStatus() {
  const hospitals = [
    {
      name: 'Ayushman Nagpur Hospital',
      occupancy: 0,
      total: 0,
      status: 'Waiting for data',
      lastUpdate: 'Not yet checked',
    },
    {
      name: 'Hope Hospital',
      occupancy: 0,
      total: 0,
      status: 'Waiting for data',
      lastUpdate: 'Not yet checked',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Hospital Occupancy</h2>
      </div>

      <div className="grid gap-4">
        {hospitals.map((hospital, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
              <span className="text-xs text-gray-500">{hospital.lastUpdate}</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {hospital.occupancy}/{hospital.total}
                  </p>
                  <p className="text-xs text-gray-600">Beds occupied</p>
                </div>
              </div>

              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${hospital.total > 0 ? (hospital.occupancy / hospital.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">{hospital.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Hospital occupancy data will be updated by ClawdBot at 8:30 AM daily before the morning huddle.
        </p>
      </div>
    </div>
  );
}
