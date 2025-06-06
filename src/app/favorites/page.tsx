"use client";

import { useEffect, useState } from "react";
import { ClothingItemCard } from "@/components/clothing/clothing-item-card";
import { OutfitCard } from "@/components/outfit/outfit-card";
import { ClothingItem, Outfit, Favorite } from "@/lib/types";
import { getFavorites } from "@/lib/api/favorites";
import { getClothingItem } from "@/lib/api/clothing";
import { getOutfit } from "@/lib/api/outfits";

interface FavoriteWithItem {
  favorite: Favorite;
  item: ClothingItem | Outfit;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteWithItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoritesData = await getFavorites();
        const itemPromises = favoritesData.map(async (favorite) => {
          const item =
            favorite.itemType === "clothing"
              ? await getClothingItem(favorite.itemId)
              : await getOutfit(favorite.itemId);
          return item ? { favorite, item } : null;
        });
        const favoritesWithItems = (await Promise.all(itemPromises)).filter(
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
  }, []);

  const clothingFavorites = favorites.filter(
    (f) => f.favorite.itemType === "clothing"
  );
  const outfitFavorites = favorites.filter(
    (f) => f.favorite.itemType === "outfit"
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
