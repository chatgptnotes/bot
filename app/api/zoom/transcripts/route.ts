import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const TRANSCRIPTS_DIR = path.join(os.homedir(), '.openclaw', 'workspace', 'transcripts');

export async function GET() {
  try {
    // Ensure directory exists
    await fs.mkdir(TRANSCRIPTS_DIR, { recursive: true });

    // Read all files in transcripts directory
    const files = await fs.readdir(TRANSCRIPTS_DIR);

    // Filter for .txt files (main transcripts)
    const txtFiles = files.filter(f => f.endsWith('.txt') && !f.endsWith('.txt.json') && !f.endsWith('.txt.srt'));

    // Get metadata for each transcript
    const transcripts = await Promise.all(
      txtFiles.map(async (filename) => {
        const filePath = path.join(TRANSCRIPTS_DIR, filename);
        const stats = await fs.stat(filePath);
        const content = await fs.readFile(filePath, 'utf-8');

        // Count words
        const wordCount = content.trim().split(/\s+/).length;

        // Check for associated files
        const jsonExists = files.includes(`${filename}.json`);
        const srtExists = files.includes(`${filename}.srt`);

        // Parse filename to extract date (format: zoom_YYYYMMDD_HHMMSS.txt)
        const match = filename.match(/zoom_(\d{8})_(\d{6})\.txt/);
        let date = stats.mtime.toISOString();
        let duration = 'Unknown';

        if (match) {
          const [, dateStr, timeStr] = match;
          const year = dateStr.substring(0, 4);
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          const hour = timeStr.substring(0, 2);
          const minute = timeStr.substring(2, 4);
          const second = timeStr.substring(4, 6);
          date = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
        }

        // Try to get duration from JSON if available
        if (jsonExists) {
          try {
            const jsonPath = path.join(TRANSCRIPTS_DIR, `${filename}.json`);
            const jsonContent = await fs.readFile(jsonPath, 'utf-8');
            const jsonData = JSON.parse(jsonContent);
            if (jsonData.duration) {
              const seconds = Math.floor(jsonData.duration);
              const minutes = Math.floor(seconds / 60);
              const remainingSeconds = seconds % 60;
              duration = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            }
          } catch (e) {
            // Ignore JSON parsing errors
          }
        }

        return {
          filename,
          date,
          duration,
          wordCount,
          size: `${(stats.size / 1024).toFixed(1)} KB`,
          hasJson: jsonExists,
          hasSrt: srtExists,
        };
      })
    );

    // Sort by date descending (newest first)
    transcripts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ transcripts });
  } catch (error) {
    console.error('Error listing transcripts:', error);
    return NextResponse.json(
      { error: 'Failed to list transcripts', transcripts: [] },
      { status: 500 }
    );
  }
}
