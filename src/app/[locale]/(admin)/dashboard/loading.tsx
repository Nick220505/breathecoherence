'use client';

export default function Loading() {
  return (
    <div className="container mx-auto animate-pulse space-y-8 py-10">
      <div className="space-y-2">
        <div className="bg-muted h-8 w-64 rounded" />
        <div className="bg-muted h-4 w-80 rounded" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map(() => (
          <div
            key={crypto.randomUUID()}
            className="rounded-lg border p-6 shadow-sm"
          >
            <div className="bg-muted mb-2 h-4 w-24 rounded" />
            <div className="bg-muted h-8 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
