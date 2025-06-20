"use client";

import { useEffect, useState } from "react";
import { ClothingItemCard } from "@/components/clothing/clothing-item-card";
import { OutfitCard } from "@/components/outfit/outfit-card";
import { ClothingItem, Outfit } from "@/lib/types";
import { getFavorites, removeFavorite } from "@/lib/api/favorites";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "react-toastify";
import type { Favorite as ApiFavorite } from "@/lib/types/api";

export function FavoritesPageClient() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState<
    (ClothingItem | (Outfit & { type: "clothing" | "outfit" }))[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!token) return;
        const data = await getFavorites(token);

        console.log("Raw favorites data:", data);

        const transformedFavorites = data
          .map((favorite: ApiFavorite) => {
            const favoritable = favorite.favoritable;

            if (!favoritable) {
              console.warn("Missing favoritable data for favorite:", favorite);
              return null;
            }

            // Use includes() to check for the type more flexibly
            const favoritableType = favorite.favoritable_type;
            console.log("Processing favoritable type:", favoritableType);

            if (favoritableType.includes("ClothingItem")) {
              // Transform clothing item data
              const clothingItem: ClothingItem & { type: "clothing" } = {
                id: favoritable.id,
                name: favoritable.name || "Unknown Item",
                size: favoritable.size || "",
                imageUrl: favoritable.image_path || favoritable.image_url || "",
                category: favoritable.category || "",
                color: favoritable.color || "",
                brand: favoritable.brand || "",
                userId: favoritable.user_id || 0,
                createdAt: favoritable.created_at || "",
                updatedAt: favoritable.updated_at || "",
                type: "clothing",
              };
              console.log("Transformed clothing item:", clothingItem);
              return clothingItem;
            } else if (favoritableType.includes("Outfit")) {
              // Transform outfit data
              const outfit: Outfit & { type: "outfit" } = {
                id: favoritable.id,
                name: favoritable.name || "Unknown Outfit",
                description: favoritable.description || "",
                clothingItemIds:
                  favoritable.clothing_items?.map((item: any) => item.id) || [],
                userId: favoritable.user_id || 0,
                createdAt: favoritable.created_at || "",
                updatedAt: favoritable.updated_at || "",
                type: "outfit",
              };
              console.log("Transformed outfit:", outfit);
              return outfit;
            }

            console.warn(
              "Unknown favoritable type:",
              favorite.favoritable_type
            );
            return null;
          })
          .filter(Boolean); // Remove null items

        console.log("Final transformed favorites:", transformedFavorites);
        setFavorites(transformedFavorites);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  const handleRemoveFavorite = async (
    id: number,
    type: "clothing" | "outfit"
  ) => {
    try {
      if (!token) return;

      const favoritableType = type === "clothing" ? "clothing_item" : "outfit";

      await removeFavorite(token, {
        favoritable_id: id,
        favoritable_type: favoritableType,
      });

      setFavorites((prev) =>
        prev.filter((item) => item.id !== id || item.type !== type)
      );

      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Favorites</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
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
        ) : favorites.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-muted-foreground">
              You haven't added any favorites yet
            </p>
          </div>
        ) : (
          favorites.map((item) =>
            item.type === "clothing" ? (
              <ClothingItemCard
                key={`clothing-${item.id}`}
                item={item as ClothingItem}
                onFavorite={() => handleRemoveFavorite(item.id, "clothing")}
                isFavorited={true}
              />
            ) : (
              <OutfitCard
                key={`outfit-${item.id}`}
                outfit={item as Outfit}
                onFavorite={() => handleRemoveFavorite(item.id, "outfit")}
                isFavorited={true}
              />
            )
          )
        )}
      </div>
    </div>
  );
}
