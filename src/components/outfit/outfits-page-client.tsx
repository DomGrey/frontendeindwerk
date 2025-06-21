"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OutfitCard } from "@/components/outfit/outfit-card";
import { OutfitDialog } from "@/components/outfit/outfit-dialog";
import { Outfit } from "@/lib/types";
import { getOutfits, createOutfit, updateOutfit } from "@/lib/api/outfits";
import { getFavoriteOutfits } from "@/lib/api/favorites";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "react-toastify";
import type { Outfit as ApiOutfit } from "@/lib/types/api";

export function OutfitsPageClient() {
  const { token } = useAuth();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const transformApiOutfit = (apiOutfit: ApiOutfit): Outfit => ({
    id: apiOutfit.id,
    name: apiOutfit.name,
    description: apiOutfit.description,
    clothingItemIds: apiOutfit.clothing_items?.map((item) => item.id) || [],
    userId: apiOutfit.user_id,
    createdAt: apiOutfit.created_at,
    updatedAt: apiOutfit.updated_at,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;

        const [outfitsResponse, favoritesData] = await Promise.all([
          getOutfits(token),
          getFavoriteOutfits(token),
        ]);

        setOutfits(outfitsResponse.outfits.map(transformApiOutfit));

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

  const handleFormSubmit = async (
    data: Omit<Outfit, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedOutfit) {
        // Update existing outfit
        const updatedOutfit: ApiOutfit = await updateOutfit(
          token,
          selectedOutfit.id,
          {
            name: data.name,
            description: data.description,
            is_public: false,
            clothing_item_ids: data.clothingItemIds,
          }
        );
        setOutfits(
          outfits.map((it) =>
            it.id === selectedOutfit.id ? transformApiOutfit(updatedOutfit) : it
          )
        );
        toast.success("Outfit updated successfully");
      } else {
        // Create new outfit
        const newOutfit: ApiOutfit = await createOutfit(token, {
          name: data.name,
          description: data.description,
          is_public: false,
          clothing_item_ids: data.clothingItemIds,
        });
        setOutfits((prev) => [...prev, transformApiOutfit(newOutfit)]);
        toast.success("Outfit created successfully");
      }
      setDialogOpen(false);
      setSelectedOutfit(undefined);
    } catch (error) {
      console.error("Failed to save outfit:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save outfit.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFavorite = (outfitId: number, isFavorited: boolean) => {
    setFavoritedIds((prev) => {
      const newSet = new Set(prev);
      if (isFavorited) {
        newSet.add(outfitId);
      } else {
        newSet.delete(outfitId);
      }
      return newSet;
    });
  };

  const handleDelete = (outfitId: number) => {
    setOutfits((prev) => prev.filter((outfit) => outfit.id !== outfitId));
    setFavoritedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(outfitId);
      return newSet;
    });
  };

  const openAddDialog = () => {
    setSelectedOutfit(undefined);
    setDialogOpen(true);
  };

  const openEditDialog = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Outfits</h1>
        <Button onClick={openAddDialog}>Create Outfit</Button>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
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
          : outfits.map((outfit) => (
              <div
                key={outfit.id}
                onClick={() => openEditDialog(outfit)}
                className="cursor-pointer"
              >
                <OutfitCard
                  outfit={outfit}
                  onFavorite={(isFavorited) =>
                    handleFavorite(outfit.id, isFavorited)
                  }
                  onDelete={() => handleDelete(outfit.id)}
                  isFavorited={favoritedIds.has(outfit.id)}
                />
              </div>
            ))}
      </div>
      <OutfitDialog
        open={dialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedOutfit(undefined);
          }
          setDialogOpen(isOpen);
        }}
        outfit={selectedOutfit}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
