"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ClothingItemCard } from "@/components/clothing/clothing-item-card";
import { ClothingItemDialog } from "@/components/clothing/clothing-item-dialog";
import { ClothingItem } from "@/lib/types";
import { getClothingItems, createClothingItem } from "@/lib/api/clothing";
import { getFavoriteClothingItems } from "@/lib/api/favorites";
import { useAuth } from "@/lib/context/auth-context";
import type { ClothingItem as ApiClothingItem } from "@/lib/types/api";

export function ClothingPageClient() {
  const { token } = useAuth();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | undefined>();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;

        // Fetch clothing items and favorites in parallel
        const [clothingData, favoritesData] = await Promise.all([
          getClothingItems(token),
          getFavoriteClothingItems(token),
        ]);

        setItems(clothingData.map(transformApiClothingItem));

        // Extract favorited item IDs
        let favoritedIdsSet = new Set<number>();

        if (Array.isArray(favoritesData)) {
          favoritedIdsSet = new Set(
            favoritesData
              .map((favorite: any) => {
                if (favorite.favoritable_id) {
                  return favorite.favoritable_id;
                } else if (favorite.id) {
                  return favorite.id;
                }
                return null;
              })
              .filter(Boolean)
          );
        }

        setFavoritedIds(favoritedIdsSet);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleAddItem = async (
    data: Omit<ClothingItem, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (!token) return;
      const newItem = await createClothingItem(token, {
        name: data.name,
        size: data.size,
        category: data.category,
        color: data.color,
        brand: data.brand,
        season: "all",
        is_public: false,
      });
      setItems((prev) => [...prev, transformApiClothingItem(newItem)]);
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to create clothing item:", error);
    }
  };

  const handleFavorite = (itemId: number, isFavorited: boolean) => {
    // Update local state optimistically
    setFavoritedIds((prev) => {
      const newSet = new Set(prev);
      if (isFavorited) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const handleDelete = (itemId: number) => {
    // Remove item from UI immediately (optimistic update)
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    // Also remove from favorites if it was favorited
    setFavoritedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Clothing</h1>
        <Button
          onClick={() => {
            setSelectedItem(undefined);
            setDialogOpen(true);
          }}
        >
          Add Item
        </Button>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
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
          : items.map((item) => (
              <ClothingItemCard
                key={item.id}
                item={item}
                onFavorite={(isFavorited) =>
                  handleFavorite(item.id, isFavorited)
                }
                onDelete={() => handleDelete(item.id)}
                isFavorited={favoritedIds.has(item.id)}
              />
            ))}
      </div>
      <ClothingItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={selectedItem}
        onSubmit={handleAddItem}
      />
    </div>
  );
}
