# OpenClaw Dashboard

Task management dashboard for Dr. Murali BK's OpenClaw AI assistant.

## Features

- 📅 Daily schedule overview
- ⏰ Automated task reminders
- 🏥 Hospital occupancy tracking (Ayushman Nagpur Hospital & Hope Hospital)
- 💊 Medicine reminders
- 💪 Workout tracking
- 📊 Project management (bettroi.com - 50+ projects)
- 🔔 Real-time notifications
- 📈 Task completion tracking

## Tech Stack

- **Framework:** Next.js 14
- **UI:** React + TailwindCSS
- **Icons:** Lucide React
- **Backend:** Node.js API routes
- **Data Source:** ClawdBot workspace files

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

Dashboard will be available at: http://localhost:3001

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
bot/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Utility functions
├── public/                # Static assets
└── package.json
```

## Configuration

The dashboard reads from ClawdBot workspace files:
- `/Users/murali/.openclaw/workspace/HEARTBEAT.md`
- `/Users/murali/.openclaw/workspace/USER.md`
- `/Users/murali/.clawdbot/cron/jobs.json`

## Dashboard Sections

1. **Daily Schedule** - Timeline view of Dr. Murali's day
2. **Active Tasks** - Current tasks from HEARTBEAT.md
3. **Cron Jobs** - Scheduled reminders and checks
4. **Hospital Status** - Ayushman Nagpur & Hope Hospital occupancy
5. **Projects** - bettroi.com project tracking
6. **Health** - Medicine and workout tracking

## Version

- **v1.0** - 2026-02-02 - Initial release
- Repository: Bot (github.com/[your-username]/bot)

---

Built for Dr. Murali BK | ClawdBot Dashboard
