# ClawdBot Dashboard - Quick Start Guide

## ✅ Dashboard is Now Running!

Your ClawdBot Dashboard is live at: **http://localhost:3001**

## 📊 Dashboard Features

### 1. Daily Schedule
- Timeline view of your entire day
- Color-coded by type (health, meeting, check, reminder)
- Real-time status tracking

### 2. Active Tasks
- All tasks from HEARTBEAT.md organized by category
- Pre-Morning Huddle tasks
- Project follow-ups
- Proactive checks
- Completion tracking

### 3. Automated Reminders (Cron Jobs)
- 6:00 AM - Wake-up reminder
- 7:00 AM - Medicine reminder
- 8:30 AM - Hospital occupancy check
- 10:45 AM - 11 AM meeting reminder
- 3:45 PM - 4 PM meeting reminder

### 4. Hospital Occupancy
- Ayushman Nagpur Hospital status
- Hope Hospital status
- Real-time bed occupancy tracking
- Daily updates before 9 AM huddle

### 5. Projects Overview
- bettroi.com (50+ projects)
- DocDRM company status
- Weekly follow-up rotation

## 🚀 Quick Commands

### Start Dashboard
```bash
cd /Users/murali/1backup/Bot
pnpm dev
```

Or use the convenient script:
```bash
./start.sh
```

### Access Dashboard
Open in browser: http://localhost:3001

### Stop Dashboard
Press `Ctrl + C` in the terminal

## 🔄 Auto-Refresh

The dashboard automatically refreshes every 60 seconds to show the latest tasks and status from ClawdBot.

You can also manually refresh by clicking the "Refresh" button in the top right.

## 📁 Data Sources

The dashboard reads from:
- `/Users/murali/.openclaw/workspace/HEARTBEAT.md` - Daily tasks
- `/Users/murali/.openclaw/workspace/USER.md` - Your profile
- `/Users/murali/.clawdbot/cron/jobs.json` - Scheduled reminders

## 🎨 Customization

### Update Tasks
Edit `/Users/murali/.openclaw/workspace/HEARTBEAT.md` and the dashboard will auto-refresh.

### Update Schedule
Edit `/Users/murali/.clawdbot/cron/jobs.json` to modify reminder times.

### Hospital Integration
To connect real hospital data, update the `HospitalStatus.tsx` component with your hospital management system API.

## 📱 Mobile Access

The dashboard is responsive and works on mobile devices. Access from any device on your local network:
- Find your local IP: `ifconfig | grep inet`
- Access: `http://YOUR_IP:3001`

## 🔐 Production Deployment

To deploy to production:

1. Build the project:
```bash
pnpm build
```

2. Start production server:
```bash
pnpm start
```

3. Or deploy to Vercel/Netlify (see README.md for details)

## 📋 Git Repository

Initialize remote repository:
```bash
git remote add origin https://github.com/[your-username]/bot.git
git push -u origin main
```

## 🆘 Troubleshooting

### Dashboard won't start
```bash
# Remove node_modules and reinstall
rm -rf node_modules
pnpm install
pnpm dev
```

### Port 3001 already in use
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
pnpm dev
```

### Can't read ClawdBot files
Check file permissions:
```bash
ls -la /Users/murali/.openclaw/workspace/
```

## 📞 Support

For issues or questions:
- Check README.md for detailed documentation
- Review component files in `app/components/`
- ClawdBot logs: `/Users/murali/.clawdbot/logs/`

---

**Version:** 1.0
**Last Updated:** 2026-02-02
**Built for:** Dr. Murali BK
