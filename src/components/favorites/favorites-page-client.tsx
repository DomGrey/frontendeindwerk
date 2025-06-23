"use client";

import { useEffect, useState } from "react";
import { ClothingItemCard } from "@/components/clothing/clothing-item-card";
import { OutfitCard } from "@/components/outfit/outfit-card";
import { getFavorites, removeFavorite } from "@/lib/api/favorites";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ClothingItem, Outfit, Favorite } from "@/lib/types/api";

export function FavoritesPageClient() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!token) return;
        const data = await getFavorites(token);
        setFavorites(data || []);
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
    type: "clothing_item" | "outfit"
  ) => {
    try {
      if (!token) return;
      await removeFavorite(token, {
        favoritable_id: id,
        favoritable_type: type,
      });
      setFavorites((prev) =>
        prev.filter(
          (fav) => fav.favoritable_id !== id || fav.favoritable_type !== type
        )
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
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Start adding items to your favorites to see them here
            </p>
            <Button onClick={() => router.push("/clothing")}>
              Browse Clothing Items
            </Button>
          </div>
        ) : (
          favorites.map((favorite) => {
            const favoritable = favorite.favoritable as
              | ClothingItem
              | Outfit
              | { id: number; status: string; message?: string };
            if ("status" in favoritable && favoritable.status === "deleted") {
              return (
                <div
                  key={`deleted-${favorite.id}`}
                  className="rounded-lg border bg-muted p-6 text-center text-muted-foreground"
                >
                  <p>{favoritable.message || "This item has been deleted."}</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() =>
                      handleRemoveFavorite(
                        favoritable.id,
                        favorite.favoritable_type
                      )
                    }
                  >
                    Remove from Favorites
                  </Button>
                </div>
              );
            }
            if (favorite.favoritable_type === "clothing_item") {
              return (
                <ClothingItemCard
                  key={`clothing-${favoritable.id}`}
                  item={favoritable as ClothingItem}
                  onFavorite={() =>
                    handleRemoveFavorite(favoritable.id, "clothing_item")
                  }
                  onDelete={() => {}}
                  isFavorited={true}
                />
              );
            }
            if (favorite.favoritable_type === "outfit") {
              return (
                <OutfitCard
                  key={`outfit-${favoritable.id}`}
                  outfit={favoritable as Outfit}
                  onFavorite={() =>
                    handleRemoveFavorite(favoritable.id, "outfit")
                  }
                  onDelete={() => {}}
                  isFavorited={true}
                />
              );
            }
            return null;
          })
        )}
      </div>
    </div>
  );
}
