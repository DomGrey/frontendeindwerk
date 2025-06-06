"use client";

import { Outfit } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OutfitCardProps {
  outfit: Outfit;
  onFavorite?: () => void;
  onDelete?: () => void;
}

export function OutfitCard({ outfit, onFavorite, onDelete }: OutfitCardProps) {
  return (
    <div className="group relative rounded-lg border bg-card text-card-foreground shadow transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-muted">
        <div className="grid h-full grid-cols-2 gap-1 p-2">
          {/* Placeholder for outfit items */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded bg-background/50 backdrop-blur"
            />
          ))}
        </div>
        {onFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur"
            onClick={onFavorite}
          >
            ♥
          </Button>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{outfit.name}</h3>
            {outfit.description && (
              <p className="text-sm text-muted-foreground">
                {outfit.description}
              </p>
            )}
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={onDelete}
            >
              🗑
            </Button>
          )}
        </div>
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">
            {outfit.clothingItemIds.length} items
          </p>
        </div>
      </div>
    </div>
  );
}
