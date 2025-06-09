// Generic API Response type
export interface ApiResponse<T> {
  data: T;
  error: null | {
    message: string;
    code: string;
  };
  meta: null | {
    pagination?: {
      total: number;
      page: number;
      pageSize: number;
    };
  };
}

// Auth types
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  data: {
    token: string;
    user: User;
  };
  error: null | { message: string; code: string };
  meta: null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Clothing Item types
export interface ClothingItem {
  id: number;
  name: string;
  description?: string;
  category: string;
  color: string;
  brand?: string;
  size: string;
  season: string;
  status?: string;
  image_url?: string;
  thumbnail_url?: string;
  care_label_url?: string;
  is_public: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ClothingItemSearchParams {
  q?: string;
  category?: string;
  color?: string;
  brand?: string;
  size?: string;
  season?: string;
  status?: string;
  per_page?: number;
}

export interface CreateClothingItemData {
  name: string;
  description?: string;
  category: string;
  color: string;
  brand?: string;
  size: string;
  season: string;
  status?: string;
  is_public: boolean;
  image?: File;
  care_label?: File;
}

// Outfit types
export interface Outfit {
  id: number;
  name: string;
  description?: string;
  is_public: boolean;
  user_id: number;
  clothing_items: ClothingItem[];
  created_at: string;
  updated_at: string;
}

export interface OutfitSearchParams {
  q?: string;
  contains_item_id?: number;
  per_page?: number;
}

export interface CreateOutfitData {
  name: string;
  description?: string;
  is_public: boolean;
  clothing_item_ids: number[];
}

// Favorite types
export type FavoriteType = "App\\Models\\ClothingItem" | "App\\Models\\Outfit";

export interface Favorite {
  id: number;
  user_id: number;
  favoritable_id: number;
  favoritable_type: FavoriteType;
  created_at: string;
  updated_at: string;
}

export interface CreateFavoriteData {
  favoritable_id: number;
  favoritable_type: FavoriteType;
}

// File upload requirements
export const FILE_REQUIREMENTS = {
  maxSize: 5 * 1024 * 1024, // 5MB in bytes
  allowedTypes: ["image/jpeg", "image/jpg", "image/png"],
} as const;
