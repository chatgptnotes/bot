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
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'txt';
    const filename = params.filename;

    let filePath: string;
    let contentType: string;
    let downloadName: string;

    switch (type) {
      case 'json':
        filePath = path.join(TRANSCRIPTS_DIR, `${filename}.json`);
        contentType = 'application/json';
        downloadName = filename.replace('.txt', '.json');
        break;
      case 'srt':
        filePath = path.join(TRANSCRIPTS_DIR, `${filename}.srt`);
        contentType = 'text/plain';
        downloadName = filename.replace('.txt', '.srt');
        break;
      default:
        filePath = path.join(TRANSCRIPTS_DIR, filename);
        contentType = 'text/plain';
        downloadName = filename;
    }

    // Security check
    const realPath = await fs.realpath(filePath);
    if (!realPath.startsWith(TRANSCRIPTS_DIR)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
    }

    const content = await fs.readFile(filePath);

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadName}"`,
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}
