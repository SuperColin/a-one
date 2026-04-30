'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
  pageUrl: string;
}

export default function NotePanel({ pageUrl }: Props) {
  const [content, setContent]     = useState('');
  const [dirty, setDirty]         = useState(false);
  const [loading, setLoading]     = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    if (!pageUrl) return;
    setLoading(true);
    fetch(`/api/notes/${encodeURIComponent(pageUrl)}`)
      .then(r => r.json())
      .then((data: { content: string; updated_at: string | null }) => {
        setContent(data.content);
        setLastSaved(data.updated_at);
        setDirty(false);
        setLoading(false);
      });
  }, [pageUrl]);

  const save = useCallback(async () => {
    setSaving(true);
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_url: pageUrl, content }),
    });
    setDirty(false);
    setLastSaved(new Date().toISOString());
    setSaving(false);
  }, [pageUrl, content]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (dirty && !saving) save();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dirty, saving, save]);

  return (
    <div className="flex flex-col h-full p-4 gap-3 bg-white">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-800">Notater</h2>
        {lastSaved && (
          <span className="text-[11px] text-slate-400 text-right">
            Lagret<br />
            {new Date(lastSaved).toLocaleString('nb-NO')}
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-400 font-mono break-all leading-relaxed">
        {pageUrl}
      </p>

      {loading ? (
        <div className="flex-1 rounded-lg bg-slate-100 animate-pulse" />
      ) : (
        <textarea
          className="flex-1 resize-none border border-slate-200 rounded-lg p-3 text-sm text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Skriv forbedringsforslag, observasjoner eller spørsmål her…"
          value={content}
          onChange={e => { setContent(e.target.value); setDirty(true); }}
        />
      )}

      <button
        onClick={save}
        disabled={!dirty || saving || loading}
        className="py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        {saving ? 'Lagrer…' : dirty ? 'Lagre notater' : '✓ Lagret'}
      </button>
      <p className="text-[10px] text-slate-300 text-center">⌘S / Ctrl+S for å lagre</p>
    </div>
  );
}
