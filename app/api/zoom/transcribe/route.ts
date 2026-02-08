import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const UPLOAD_DIR = path.join(os.tmpdir(), 'zoom-uploads');
const TRANSCRIPTS_DIR = path.join(os.homedir(), '.openclaw', 'workspace', 'transcripts');
const TRANSCRIBE_SCRIPT = path.join(os.homedir(), '.openclaw', 'workspace', 'skills', 'zoom-transcription', 'transcribe-zoom.sh');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['video/', 'audio/'];
    if (!validTypes.some(type => file.type.startsWith(type))) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a video or audio file.' },
        { status: 400 }
      );
    }

    // Create upload directory
    const { mkdir } = await import('fs/promises');
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Save uploaded file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name);
    const uploadPath = path.join(UPLOAD_DIR, `upload_${Date.now()}${ext}`);
    await writeFile(uploadPath, buffer);

    // Get OpenAI API key from openclaw config
    const configPath = path.join(os.homedir(), '.openclaw', 'openclaw.json');
    let apiKey = process.env.OPENAI_API_KEY;

    try {
      const { readFile } = await import('fs/promises');
      const configContent = await readFile(configPath, 'utf-8');
      const config = JSON.parse(configContent);
      if (config.env?.OPENAI_API_KEY) {
        apiKey = config.env.OPENAI_API_KEY;
      }
    } catch (e) {
      console.log('Could not read OpenClaw config, using env variable');
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in ~/.openclaw/openclaw.json' },
        { status: 500 }
      );
    }

    // Run transcription script
    const env = {
      ...process.env,
      OPENAI_API_KEY: apiKey,
    };

    console.log('Starting transcription for:', uploadPath);
    const { stdout, stderr } = await execAsync(
      `"${TRANSCRIBE_SCRIPT}" "${uploadPath}"`,
      {
        env,
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      }
    );

    console.log('Transcription output:', stdout);
    if (stderr) {
      console.error('Transcription stderr:', stderr);
    }

    // Clean up uploaded file
    try {
      const { unlink } = await import('fs/promises');
      await unlink(uploadPath);
    } catch (e) {
      console.error('Failed to delete upload file:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Transcription completed successfully',
    });
  } catch (error: any) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      {
        error: 'Transcription failed',
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
