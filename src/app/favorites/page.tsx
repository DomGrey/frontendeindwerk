"use client";

import { useEffect, useState } from "react";
import { ClothingItemCard } from "@/components/clothing/clothing-item-card";
import { OutfitCard } from "@/components/outfit/outfit-card";
import { ClothingItem, Outfit } from "@/lib/types";
import { getFavorites } from "@/lib/api/favorites";
import { getClothingItem } from "@/lib/api/clothing";
import { getOutfit } from "@/lib/api/outfits";
import { useAuth } from "@/lib/context/auth-context";
import type {
  Favorite as ApiFavorite,
  ClothingItem as ApiClothingItem,
  Outfit as ApiOutfit,
} from "@/lib/types/api";

interface FavoriteWithItem {
  favorite: ApiFavorite;
  item: ClothingItem | Outfit;
}

export default function FavoritesPage() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteWithItem[]>([]);
  const [loading, setLoading] = useState(true);

  const transformApiClothingItem = (
    apiItem: ApiClothingItem
  ): ClothingItem => ({
    id: apiItem.id,
    name: apiItem.name,
    size: apiItem.size,
    imageUrl: apiItem.image_url || "",
    category: apiItem.category,
    color: apiItem.color,
    brand: apiItem.brand,
    userId: apiItem.user_id,
    createdAt: apiItem.created_at,
    updatedAt: apiItem.updated_at,
  });

  const transformApiOutfit = (apiOutfit: ApiOutfit): Outfit => ({
    id: apiOutfit.id,
    name: apiOutfit.name,
    description: apiOutfit.description,
    clothingItemIds: apiOutfit.clothing_items.map((item) => item.id),
    userId: apiOutfit.user_id,
    createdAt: apiOutfit.created_at,
    updatedAt: apiOutfit.updated_at,
  });

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!token) return;
        const favoritesData = await getFavorites(token);
        const itemPromises = favoritesData.map(async (favorite) => {
          try {
            const apiItem =
              favorite.favoritable_type === "App\\Models\\ClothingItem"
                ? await getClothingItem(token, favorite.favoritable_id)
                : await getOutfit(token, favorite.favoritable_id);

            if (!apiItem) return null;

            const item =
              favorite.favoritable_type === "App\\Models\\ClothingItem"
                ? transformApiClothingItem(apiItem as ApiClothingItem)
                : transformApiOutfit(apiItem as ApiOutfit);

            return { favorite, item };
          } catch (error) {
            console.error(
              `Failed to fetch item for favorite ${favorite.id}:`,
              error
            );
            return null;
          }
        });

        const results = await Promise.all(itemPromises);
        const favoritesWithItems = results.filter(
          (result): result is FavoriteWithItem => result !== null
        );
        setFavorites(favoritesWithItems);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  const clothingFavorites = favorites.filter(
    (f) => f.favorite.favoritable_type === "App\\Models\\ClothingItem"
  );
  const outfitFavorites = favorites.filter(
    (f) => f.favorite.favoritable_type === "App\\Models\\Outfit"
  );

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Favorite Clothing</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border bg-card text-card-foreground shadow animate-pulse"
                  >
                    <div className="aspect-square bg-muted" />
                    <div className="p-6">
                      <div className="h-4 w-2/3 bg-muted rounded mb-2" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                  </div>
                ))
              : clothingFavorites.map(({ favorite, item }) => (
                  <ClothingItemCard
                    key={favorite.id}
                    item={item as ClothingItem}
                    onFavorite={() => {
                      // TODO: Implement unfavorite functionality
                      console.log("Unfavorite:", favorite.id);
                    }}
                  />
                ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4">Favorite Outfits</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border bg-card text-card-foreground shadow animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-6">
                      <div className="h-4 w-2/3 bg-muted rounded mb-2" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                  </div>
                ))
              : outfitFavorites.map(({ favorite, item }) => (
                  <OutfitCard
                    key={favorite.id}
                    outfit={item as Outfit}
                    onFavorite={() => {
                      // TODO: Implement unfavorite functionality
                      console.log("Unfavorite:", favorite.id);
                    }}
                  />
                ))}
          </div>
        </section>
      </div>
    </div>
  );
}
