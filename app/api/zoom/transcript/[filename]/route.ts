import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const TRANSCRIPTS_DIR = path.join(os.homedir(), '.openclaw', 'workspace', 'transcripts');

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const filePath = path.join(TRANSCRIPTS_DIR, filename);

    // Security check: ensure the file is within the transcripts directory
    const realPath = await fs.realpath(filePath);
    if (!realPath.startsWith(TRANSCRIPTS_DIR)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
    }

    const content = await fs.readFile(filePath, 'utf-8');

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error reading transcript:', error);
    return NextResponse.json(
      { error: 'Failed to read transcript' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;

    // Delete all associated files (.txt, .txt.json, .txt.srt)
    const filesToDelete = [
      filename,
      `${filename}.json`,
      `${filename}.srt`,
    ];

    for (const file of filesToDelete) {
      const filePath = path.join(TRANSCRIPTS_DIR, file);
      try {
        await fs.unlink(filePath);
      } catch (e) {
        // Ignore if file doesn't exist
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transcript:', error);
    return NextResponse.json(
      { error: 'Failed to delete transcript' },
      { status: 500 }
    );
  }
}
