"use client";

import { useState } from "react";
import { ClothingItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "react-toastify";
import { deleteClothingItem } from "@/lib/api/clothing";
import { useAuth } from "@/lib/context/auth-context";

interface ClothingItemCardProps {
  item: ClothingItem;
  onFavorite: (isFavorited: boolean) => void;
  onDelete: () => void;
  isFavorited: boolean;
}

export function ClothingItemCard({
  item,
  onFavorite,
  onDelete,
  isFavorited,
}: ClothingItemCardProps) {
  const { token } = useAuth();
  const { toggleFavorite, isLoading: isFavoriteLoading } = useFavorites();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
      toast.error("Failed to delete clothing item");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden">
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

          <div className="absolute right-2 top-2 z-10 flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur hover:bg-background/90"
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
              <h3 className="font-semibold text-sm">{item.name}</h3>
              <p className="text-xs text-muted-foreground">
                {item.brand && `${item.brand} • `}
                {item.size}
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {item.color}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {item.season}
            </Badge>
          </div>
        </CardContent>
      </Card>

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
