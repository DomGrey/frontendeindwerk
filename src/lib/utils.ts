import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ClothingItem as ApiClothingItem,
  Outfit as ApiOutfit,
  OutfitSchedule as ApiOutfitSchedule,
  ClothingItem,
  Outfit,
  OutfitSchedule,
} from "@/lib/types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toClothingItem(apiItem: ApiClothingItem): ClothingItem {
  return apiItem;
}

export function toOutfit(apiOutfit: ApiOutfit): Outfit {
  return apiOutfit;
}

export function toOutfitSchedule(
  apiSchedule: ApiOutfitSchedule
): OutfitSchedule {
  return {
    id: apiSchedule.id,
    scheduled_date: apiSchedule.scheduled_date,
    outfit: toOutfit(apiSchedule.outfit),
  };
}

const RECENTLY_VIEWED_KEY = "recentlyViewedClothing";
const MAX_RECENT_ITEMS = 8;

export function addToRecentlyViewed(item: ClothingItem): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getRecentlyViewed();
    const filtered = existing.filter(
      (existingItem) => existingItem.id !== item.id
    );
    const updated = [item, ...filtered].slice(0, MAX_RECENT_ITEMS);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save recently viewed item:", error);
  }
}

export function getRecentlyViewed(): ClothingItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to get recently viewed items:", error);
    return [];
  }
}

export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch (error) {
    console.error("Failed to clear recently viewed items:", error);
  }
}

export function getRandomItems<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
