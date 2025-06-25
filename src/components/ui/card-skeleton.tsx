"use client";

export default function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-6">
        <div className="h-4 w-2/3 bg-muted rounded mb-2" />
        <div className="h-3 w-1/2 bg-muted rounded" />
      </div>
    </div>
  );
}
