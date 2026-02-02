import { NextResponse } from 'next/server';
import { readHeartbeat, readCronJobs, getDailySchedule, getUserProfile } from '@/lib/clawdbot';

export async function GET() {
  try {
    const tasks = readHeartbeat();
    const cronJobs = readCronJobs();
    const schedule = getDailySchedule();
    const profile = getUserProfile();

    return NextResponse.json({
      tasks,
      cronJobs,
      schedule,
      profile,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
