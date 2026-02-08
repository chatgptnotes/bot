'use client';

import Link from 'next/link';
import ZoomMeetings from '../components/ZoomMeetings';
import { Home, ArrowLeft } from 'lucide-react';

export default function ZoomPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Zoom Meeting Transcripts</h1>
          <p className="text-gray-600">
            Upload, transcribe, and manage your Zoom meeting recordings with AI-powered transcription
          </p>
        </div>

        <ZoomMeetings />

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 font-semibold mb-2">📤 Upload</div>
            <p className="text-sm text-gray-600">
              Drag and drop or click to upload Zoom recordings (MP4, MOV, or audio files)
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-green-600 font-semibold mb-2">🤖 Transcribe</div>
            <p className="text-sm text-gray-600">
              Automatic transcription using OpenAI Whisper API with 95%+ accuracy
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-purple-600 font-semibold mb-2">📥 Download</div>
            <p className="text-sm text-gray-600">
              Get transcripts in TXT, JSON (with timestamps), or SRT subtitle format
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✓</span>
              <div>
                <div className="font-medium text-gray-900">AI-Powered Transcription</div>
                <div className="text-sm text-gray-600">OpenAI Whisper API with industry-leading accuracy</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✓</span>
              <div>
                <div className="font-medium text-gray-900">Multiple Formats</div>
                <div className="text-sm text-gray-600">Export as TXT, JSON with timestamps, or SRT subtitles</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✓</span>
              <div>
                <div className="font-medium text-gray-900">Search & Filter</div>
                <div className="text-sm text-gray-600">Quickly find transcripts by date or keywords</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✓</span>
              <div>
                <div className="font-medium text-gray-900">Integrated with OpenClaw</div>
                <div className="text-sm text-gray-600">Seamlessly works with your OpenClaw workflow</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t mt-8">
        <p>OpenClaw Dashboard - Zoom Transcription Module | Powered by OpenAI Whisper API</p>
      </footer>
    </div>
  );
}
