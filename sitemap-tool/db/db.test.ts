import { getDb } from './db';
import { unlinkSync, existsSync } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db', 'database.db');

afterAll(() => {
  global.__db = undefined;
  if (existsSync(DB_PATH)) unlinkSync(DB_PATH);
});

test('creates notes table on first call', () => {
  const db = getDb();
  const row = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='notes'")
    .get() as { name: string } | undefined;
  expect(row?.name).toBe('notes');
});

test('upserts and retrieves a note', () => {
  const db = getDb();
  db.prepare(
    'INSERT OR REPLACE INTO notes (page_url, content) VALUES (?, ?)'
  ).run('https://a-one.no/test/', 'hello');
  const row = db
    .prepare('SELECT content FROM notes WHERE page_url = ?')
    .get('https://a-one.no/test/') as { content: string };
  expect(row.content).toBe('hello');
});

test('returns empty string for unknown page', () => {
  const db = getDb();
  const row = db
    .prepare('SELECT content FROM notes WHERE page_url = ?')
    .get('https://a-one.no/unknown/') as { content: string } | undefined;
  expect(row?.content ?? '').toBe('');
});
