"use client";

import { useState } from "react";
import { Outfit } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2 } from "lucide-react";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "react-toastify";
import { deleteOutfit } from "@/lib/api/outfits";
import { useAuth } from "@/lib/context/auth-context";

interface OutfitCardProps {
  outfit: Outfit;
  onFavorite: (isFavorited: boolean) => void;
  onDelete: () => void;
  isFavorited: boolean;
}

export function OutfitCard({
  outfit,
  onFavorite,
  onDelete,
  isFavorited,
}: OutfitCardProps) {
  const { token } = useAuth();
  const { toggleFavorite, isLoading: isFavoriteLoading } = useFavorites();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
    } catch {
      toast.error("Failed to delete outfit");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <div className="grid h-full grid-cols-2 gap-1 p-2">
            {/* Placeholder for outfit items */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded bg-background/50 backdrop-blur"
              />
            ))}
          </div>

          {/* Always visible action buttons */}
          <div className="absolute right-2 top-2 z-10 flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur hover:bg-background/90"
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
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">{outfit.name}</h3>
              {outfit.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {outfit.description}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3">
            <Badge variant="secondary" className="text-xs">
              {outfit.clothingItemIds.length} items
            </Badge>
          </div>
        </CardContent>
      </Card>

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
