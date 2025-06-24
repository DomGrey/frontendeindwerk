// Generic API Response type
export interface ApiResponse<T> {
  readonly data: T;
  readonly error: null | {
    readonly message: string;
    readonly code: string;
  };
  readonly meta: null | {
    readonly pagination?: {
      readonly total: number;
      readonly page: number;
      readonly pageSize: number;
    };
  };
}

// Auth types
export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly profile_photo_url?: string;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface AuthResponse {
  readonly data: {
    readonly token: string;
    readonly user: User;
  };
  readonly error: null | { readonly message: string; readonly code: string };
  readonly meta: null;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterCredentials {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly password_confirmation: string;
}

export interface UpdateProfileData {
  readonly name?: string;
  readonly email?: string;
  readonly password?: string;
  readonly password_confirmation?: string;
}

// Updated Clothing Item types with extended options
export type ClothingCategory =
  | "top"
  | "bottom"
  | "dress"
  | "outerwear"
  | "shoes"
  | "accessory"
  | "sleepwear";

export type ClothingSize =
  // Letter sizes
  | "XXS"
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"
  | "XXXL"
  | "One Size"
  // Number sizes
  | "32"
  | "34"
  | "36"
  | "38"
  | "40"
  | "42"
  | "44"
  | "46"
  | "48"
  | "50"
  | "52"
  | "54"
  | "56"
  | "58"
  | "60";

export type ClothingSeason =
  | "all-year"
  | "spring"
  | "summer"
  | "fall"
  | "winter";

export type ItemStatus = "active" | "inactive";

export interface ClothingItem {
  readonly id: number;
  readonly name: string;
  readonly description?: string;
  readonly category: ClothingCategory;
  readonly color: string;
  readonly brand?: string;
  readonly size: ClothingSize;
  readonly season: ClothingSeason;
  readonly status?: ItemStatus;
  readonly image_path?: string;
  readonly image_url?: string;
  readonly thumbnail_url?: string;
  readonly care_label_path?: string;
  readonly care_label_url?: string;
  readonly is_public: boolean;
  readonly user_id: number;
  readonly user?: User;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface ClothingItemSearchParams {
  readonly q?: string;
  readonly category?: ClothingCategory;
  readonly color?: string;
  readonly brand?: string;
  readonly size?: ClothingSize;
  readonly season?: ClothingSeason;
  readonly status?: ItemStatus;
  readonly per_page?: number;
}

export interface CreateClothingItemData {
  readonly name: string;
  readonly description?: string;
  readonly category: ClothingCategory;
  readonly color: string;
  readonly brand?: string;
  readonly size: ClothingSize;
  readonly season: ClothingSeason;
  readonly status?: ItemStatus;
  readonly is_public: boolean;
  readonly image?: File;
  readonly care_label?: File;
}

// Clothing Item Options
export interface ClothingItemOptions {
  readonly categories: readonly ClothingCategory[];
  readonly sizes: readonly ClothingSize[];
  readonly seasons: readonly ClothingSeason[];
}

// Outfit types
export interface Outfit {
  readonly id: number;
  readonly name: string;
  readonly description?: string;
  readonly is_public: boolean;
  readonly user_id: number;
  readonly user?: User;
  readonly clothing_items: readonly ClothingItem[];
  readonly created_at: string;
  readonly updated_at: string;
}

export interface OutfitSearchParams {
  readonly q?: string;
  readonly contains_item_id?: number;
  readonly per_page?: number;
}

export interface CreateOutfitData {
  readonly name: string;
  readonly description?: string;
  readonly is_public: boolean;
  readonly clothing_item_ids: readonly number[];
}

// Favorite types
export type FavoriteType = "clothing_item" | "outfit";

export interface DeletedItem {
  readonly id: number;
  readonly status: "deleted";
  readonly message: string;
}

export interface Favorite {
  readonly id: number;
  readonly user_id: number;
  readonly favoritable_id: number;
  readonly favoritable_type: FavoriteType;
  readonly favoritable: ClothingItem | Outfit | DeletedItem;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface ClothingItemFavorite
  extends Omit<Favorite, "favoritable_type" | "favoritable"> {
  readonly favoritable_type: "clothing_item";
  readonly favoritable: ClothingItem;
}

export interface OutfitFavorite
  extends Omit<Favorite, "favoritable_type" | "favoritable"> {
  readonly favoritable_type: "outfit";
  readonly favoritable: Outfit;
}

export interface DeletedFavorite extends Omit<Favorite, "favoritable"> {
  readonly favoritable: DeletedItem;
}

export interface CreateFavoriteData {
  readonly favoritable_id: number;
  readonly favoritable_type: FavoriteType;
}

// Type guards
export const isClothingItemFavorite = (
  favorite: Favorite
): favorite is ClothingItemFavorite => {
  return (
    favorite.favoritable_type === "clothing_item" &&
    "name" in favorite.favoritable
  );
};

export const isOutfitFavorite = (
  favorite: Favorite
): favorite is OutfitFavorite => {
  return (
    favorite.favoritable_type === "outfit" &&
    "clothing_items" in favorite.favoritable
  );
};

export const isDeletedFavorite = (
  favorite: Favorite
): favorite is DeletedFavorite => {
  return (
    "status" in favorite.favoritable &&
    favorite.favoritable.status === "deleted"
  );
};

// File upload requirements
export const FILE_REQUIREMENTS = {
  maxSize: 5 * 1024 * 1024, // 5MB in bytes
  allowedTypes: ["image/jpeg", "image/jpg", "image/png"],
} as const;

export interface OutfitSchedule {
  readonly id: number;
  readonly scheduled_date: string;
  readonly outfit: Outfit;
}

// API response types
export type FavoritesResponse = ApiResponse<readonly Favorite[]>;
export type ClothingItemsResponse = ApiResponse<readonly ClothingItem[]>;
export type OutfitsResponse = ApiResponse<readonly Outfit[]>;
export type ClothingItemOptionsResponse = ApiResponse<ClothingItemOptions>;
