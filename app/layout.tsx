import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClawdBot Dashboard - Dr. Murali BK',
  description: 'Task management dashboard for ClawdBot assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
