"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ClothingItemCard } from "@/components/clothing/clothing-item-card";
import { ClothingItemDialog } from "@/components/clothing/clothing-item-dialog";
import { ClothingItem } from "@/lib/types";
import {
  getClothingItems,
  createClothingItem,
  updateClothingItem,
} from "@/lib/api/clothing";
import { getFavoriteClothingItems } from "@/lib/api/favorites";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "react-toastify";
import type { ClothingItem as ApiClothingItem } from "@/lib/types/api";

export function ClothingPageClient() {
  const { token } = useAuth();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        const [clothingData, favoritesData] = await Promise.all([
          getClothingItems(token),
          getFavoriteClothingItems(token),
        ]);

        setItems(clothingData.map(transformApiClothingItem));

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

  const handleFormSubmit = async (formData: FormData) => {
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedItem) {
        const updatedItem: ApiClothingItem = await updateClothingItem(
          token,
          selectedItem.id,
          formData
        );
        setItems(
          items.map((it) =>
            it.id === selectedItem.id
              ? transformApiClothingItem(updatedItem)
              : it
          )
        );
        toast.success("Clothing item updated successfully");
      } else {
        const newItem: ApiClothingItem = await createClothingItem(
          token,
          formData
        );
        setItems((prev) => [...prev, transformApiClothingItem(newItem)]);
        toast.success("Clothing item added successfully");
      }
      setDialogOpen(false);
      setSelectedItem(undefined);
    } catch (error) {
      console.error("Failed to save clothing item:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save item.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFavorite = (itemId: number, isFavorited: boolean) => {
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
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setFavoritedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const openAddDialog = () => {
    setSelectedItem(undefined);
    setDialogOpen(true);
  };

  const openEditDialog = (item: ClothingItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Clothing</h1>
        <Button onClick={openAddDialog}>Add Item</Button>
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
              <div
                key={item.id}
                onClick={() => openEditDialog(item)}
                className="cursor-pointer"
              >
                <ClothingItemCard
                  item={item}
                  onFavorite={(isFavorited) =>
                    handleFavorite(item.id, isFavorited)
                  }
                  onDelete={() => handleDelete(item.id)}
                  isFavorited={favoritedIds.has(item.id)}
                />
              </div>
            ))}
      </div>
      <ClothingItemDialog
        open={dialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedItem(undefined);
          }
          setDialogOpen(isOpen);
        }}
        item={selectedItem}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
