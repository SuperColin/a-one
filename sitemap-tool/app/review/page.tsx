import { Suspense } from 'react';
import ReviewContent from './ReviewContent';

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen text-slate-400">Laster…</div>
    }>
      <ReviewContent />
    </Suspense>
  );
}
