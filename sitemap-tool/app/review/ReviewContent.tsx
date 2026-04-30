'use client';

import { useSearchParams } from 'next/navigation';
import NotePanel from '@/components/NotePanel';
import Link from 'next/link';

export default function ReviewContent() {
  const searchParams = useSearchParams();
  const pageUrl = searchParams.get('page') ?? '';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Left: iframe panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-slate-200 shrink-0">
          <Link href="/" className="text-slate-400 hover:text-slate-700 transition-colors text-xs">
            ← Sitemap
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-400">Forhåndsvisning</span>
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline truncate max-w-lg"
          >
            {pageUrl}
          </a>
        </div>
        {pageUrl ? (
          <iframe
            src={pageUrl}
            className="flex-1 w-full border-0"
            title="Page preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Ingen side valgt
          </div>
        )}
      </div>

      {/* Right: note panel */}
      <div className="w-80 shrink-0 border-l border-slate-200 flex flex-col">
        <NotePanel pageUrl={pageUrl} />
      </div>
    </div>
  );
}
