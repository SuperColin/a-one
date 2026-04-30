import { NextResponse } from 'next/server';
import { getDb } from '@/db/db';

export function GET() {
  const db = getDb();
  const rows = db
    .prepare("SELECT page_url FROM notes WHERE content != ''")
    .all() as { page_url: string }[];
  return NextResponse.json(rows.map(r => r.page_url));
}

export async function POST(request: Request) {
  const body = await request.json() as { page_url?: string; content?: string };
  if (!body.page_url) {
    return NextResponse.json({ error: 'page_url required' }, { status: 400 });
  }
  const db = getDb();
  db.prepare(`
    INSERT INTO notes (page_url, content, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(page_url) DO UPDATE SET
      content    = excluded.content,
      updated_at = excluded.updated_at
  `).run(body.page_url, body.content ?? '');
  return NextResponse.json({ ok: true });
}
