"use client";

import { ClothingItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ClothingItemCardProps {
  item: ClothingItem;
  onFavorite?: () => void;
  onDelete?: () => void;
}

export function ClothingItemCard({
  item,
  onFavorite,
  onDelete,
}: ClothingItemCardProps) {
  return (
    <div className="group relative rounded-lg border bg-card text-card-foreground shadow transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="object-cover transition-transform group-hover:scale-105"
        />
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
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-muted-foreground">
              {item.brand && `${item.brand} • `}
              {item.size}
            </p>
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
        <div className="mt-2 flex gap-2">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
            {item.category}
          </span>
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
            {item.color}
          </span>
        </div>
      </div>
    </div>
  );
}
