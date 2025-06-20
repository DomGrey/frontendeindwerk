"use client";

import { useState } from "react";
import { Outfit } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "react-toastify";
import { deleteOutfit } from "@/lib/api/outfits";
import { useAuth } from "@/lib/context/auth-context";

interface OutfitCardProps {
  outfit: Outfit;
  onFavorite?: (isFavorited: boolean) => void;
  onDelete?: () => void;
  isFavorited?: boolean;
}

export function OutfitCard({
  outfit,
  onFavorite,
  onDelete,
  isFavorited = false,
}: OutfitCardProps) {
  const { token } = useAuth();
  const { toggleFavorite, isLoading: isFavoriteLoading } = useFavorites();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFavorite = async () => {
    if (!token) return;

    const newFavoritedState = await toggleFavorite(
      outfit.id,
      "outfit",
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
      await deleteOutfit(token, outfit.id);
      toast.success("Outfit deleted successfully");
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Delete error:", error);

      if (error instanceof Error) {
        if (error.message.includes("403")) {
          toast.error("You don't have permission to delete this outfit");
        } else if (error.message.includes("404")) {
          toast.error("Outfit not found");
        } else if (error.message.includes("401")) {
          toast.error("Please log in again");
        } else {
          toast.error(error.message || "Failed to delete outfit");
        }
      } else {
        toast.error("Failed to delete outfit");
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="group relative rounded-lg border bg-card text-card-foreground shadow transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-muted">
          <div className="grid h-full grid-cols-2 gap-1 p-2">
            {/* Placeholder for outfit items */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded bg-background/50 backdrop-blur"
              />
            ))}
          </div>
          <div className="absolute right-2 top-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur hover:bg-background/90"
              onClick={handleFavorite}
              disabled={isFavoriteLoading(outfit.id, "outfit")}
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
              <h3 className="font-semibold">{outfit.name}</h3>
              {outfit.description && (
                <p className="text-sm text-muted-foreground">
                  {outfit.description}
                </p>
              )}
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              {outfit.clothingItemIds.length} items
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Outfit"
        description={`Are you sure you want to delete "${outfit.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </>
  );
}
