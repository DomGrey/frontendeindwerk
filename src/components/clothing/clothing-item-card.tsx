"use client";

import { useState } from "react";
import { ClothingItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "react-toastify";
import { deleteClothingItem } from "@/lib/api/clothing";
import { useAuth } from "@/lib/context/auth-context";

interface ClothingItemCardProps {
  item: ClothingItem;
  onFavorite?: (isFavorited: boolean) => void;
  onDelete?: () => void;
  isFavorited?: boolean;
}

export function ClothingItemCard({
  item,
  onFavorite,
  onDelete,
  isFavorited = false,
}: ClothingItemCardProps) {
  const { token } = useAuth();
  const { toggleFavorite, isLoading: isFavoriteLoading } = useFavorites();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFavorite = async () => {
    if (!token) return;

    const newFavoritedState = await toggleFavorite(
      item.id,
      "clothing_item",
      isFavorited
    );

    if (onFavorite) {
      onFavorite(newFavoritedState);
    }
  };

  const handleDelete = async () => {
    if (!token) return;

    setIsDeleting(true);
    try {
      await deleteClothingItem(token, item.id);
      toast.success("Clothing item deleted successfully");
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Delete error:", error);

      // Handle specific error codes
      if (error instanceof Error) {
        if (error.message.includes("403")) {
          toast.error("You don't have permission to delete this item");
        } else if (error.message.includes("404")) {
          toast.error("Item not found");
        } else if (error.message.includes("401")) {
          toast.error("Please log in again");
        } else {
          toast.error(error.message || "Failed to delete item");
        }
      } else {
        toast.error("Failed to delete item");
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="group relative rounded-lg border bg-card text-card-foreground shadow transition-shadow hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <div className="absolute right-2 top-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur hover:bg-background/90"
              onClick={handleFavorite}
              disabled={isFavoriteLoading(item.id, "clothing_item")}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorited
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur hover:bg-background/90 hover:text-red-500"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                {item.brand && `${item.brand} • `}
                {item.size}
              </p>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
              {item.category}
            </span>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
              {item.color}
            </span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Clothing Item"
        description={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </>
  );
}
