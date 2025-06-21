import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ClothingItem as ApiClothingItem } from "@/lib/types/api";
import { ClothingItem } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toClothingItem(apiItem: ApiClothingItem): ClothingItem {
  return {
    id: apiItem.id,
    name: apiItem.name,
    category: apiItem.category,
    season: apiItem.season,
    color: apiItem.color,
    imageUrl: apiItem.image_url,
    userId: apiItem.user_id,
    createdAt: apiItem.created_at,
    updatedAt: apiItem.updated_at,
  };
}
