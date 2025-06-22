import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ClothingItem as ApiClothingItem } from "@/lib/types/api";
import { ClothingItem } from "@/lib/types";
import { API_BASE_URL } from "@/lib/api/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getImageUrl(imagePath?: string): string {
  if (!imagePath) return "";

  // The API_BASE_URL might be http://localhost:3000/api or http://localhost:8000/api
  // Images are served from the /storage path at the root of the API domain.
  const baseUrl = API_BASE_URL.replace("/api", "");
  return `${baseUrl}/storage/${imagePath}`;
}

export function toClothingItem(apiItem: ApiClothingItem): ClothingItem {
  return {
    id: apiItem.id,
    name: apiItem.name,
    category: apiItem.category,
    season: apiItem.season,
    color: apiItem.color,
    brand: apiItem.brand,
    size: apiItem.size,
    imageUrl: getImageUrl(apiItem.image_path),
    userId: apiItem.user_id,
    createdAt: apiItem.created_at,
    updatedAt: apiItem.updated_at,
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
