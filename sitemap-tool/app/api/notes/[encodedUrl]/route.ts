import { NextResponse } from 'next/server';
import { getDb } from '@/db/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ encodedUrl: string }> }
) {
  const { encodedUrl } = await params;
  const page_url = decodeURIComponent(encodedUrl);
  const db = getDb();
  const row = db
    .prepare('SELECT content, updated_at FROM notes WHERE page_url = ?')
    .get(page_url) as { content: string; updated_at: string } | undefined;
  return NextResponse.json({
    content: row?.content ?? '',
    updated_at: row?.updated_at ?? null,
  });
}
