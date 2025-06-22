"use client";

import { ClothingItem } from "@/lib/types";
import { DashboardItemCard } from "./dashboard-item-card";
import { Sparkles } from "lucide-react";
import { getRandomItems } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface RandomSuggestionsProps {
  items: ClothingItem[];
}

export function RandomSuggestions({ items }: RandomSuggestionsProps) {
  if (items.length === 0) return null;

  const randomItems = getRandomItems(items, Math.min(6, items.length));

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Discover Your Style</h2>
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {randomItems.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 md:pl-4"
            >
              <DashboardItemCard item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
