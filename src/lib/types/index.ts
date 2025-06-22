export interface User {
  id: number;
  name: string;
  email: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClothingItem {
  id: number;
  name: string;
  size: string;
  imageUrl: string;
  category: string;
  color: string;
  brand?: string;
  season: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Outfit {
  id: number;
  name: string;
  description?: string;
  clothingItemIds: number[];
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: number;
  userId: number;
  itemType: "clothing" | "outfit";
  itemId: number;
  createdAt: string;
}
