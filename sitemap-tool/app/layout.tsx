import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'A-One.no — Site Diagram',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>{children}</body>
    </html>
  );
}
