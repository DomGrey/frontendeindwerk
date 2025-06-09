"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ClothingItemCard } from "@/components/clothing/clothing-item-card";
import { ClothingItemDialog } from "@/components/clothing/clothing-item-dialog";
import { ClothingItem } from "@/lib/types";
import { getClothingItems, createClothingItem } from "@/lib/api/clothing";
import { useAuth } from "@/lib/context/auth-context";
import type { ClothingItem as ApiClothingItem } from "@/lib/types/api";

export default function ClothingPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<ClothingItem[]>([]);
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
    const fetchItems = async () => {
      try {
        if (!token) return;
        const data = await getClothingItems(token);
        setItems(data.map(transformApiClothingItem));
      } catch (error) {
        console.error("Failed to fetch clothing items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
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
        season: "all", // Default value since it's required by API
        is_public: false,
      });
      setItems((prev) => [...prev, transformApiClothingItem(newItem)]);
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to create clothing item:", error);
    }
  };

  return (
    <div className="container py-8">
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                onFavorite={() => {
                  // TODO: Implement favorite functionality
                  console.log("Favorite:", item.id);
                }}
                onDelete={() => {
                  // TODO: Implement delete functionality
                  console.log("Delete:", item.id);
                }}
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
