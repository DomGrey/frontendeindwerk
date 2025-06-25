"use client";

import { useEffect, useState, useMemo } from "react";
import { ClothingItemCard } from "@/components/clothing/clothing-item-card";
import { OutfitCard } from "@/components/outfit/outfit-card";
import { getFavorites, removeFavorite } from "@/lib/api/favorites";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import type { Favorite } from "@/lib/types/api";
import {
  isClothingItemFavorite,
  isOutfitFavorite,
  isDeletedFavorite,
} from "@/lib/types/api";

export function FavoritesPageClient() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!token) return;
        const response = await getFavorites(token);
        setFavorites(response.data || []);
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
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  const filteredClothing = useMemo(
    () =>
      favorites.filter(
        (fav) =>
          isClothingItemFavorite(fav) &&
          fav.favoritable.name.toLowerCase().includes(search.toLowerCase())
      ),
    [favorites, search]
  );

  const filteredOutfits = useMemo(
    () =>
      favorites.filter(
        (fav) =>
          isOutfitFavorite(fav) &&
          fav.favoritable.name.toLowerCase().includes(search.toLowerCase())
      ),
    [favorites, search]
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Favorites</h1>
      <div className="mb-6 max-w-md">
        <Input
          placeholder="Search favorites..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Favorite Clothing</h2>
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
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
            ))}
          </div>
        ) : filteredClothing.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="mx-auto h-8 w-8 mb-2" />
            <div>No favorite clothing items found.</div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {filteredClothing.map((favorite) =>
              isClothingItemFavorite(favorite) ? (
                <ClothingItemCard
                  key={`clothing-${favorite.favoritable.id}`}
                  item={favorite.favoritable}
                  onFavorite={() =>
                    handleRemoveFavorite(
                      favorite.favoritable.id,
                      "clothing_item"
                    )
                  }
                  onDelete={() => {}}
                  isFavorited={true}
                />
              ) : null
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Favorite Outfits</h2>
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
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
            ))}
          </div>
        ) : filteredOutfits.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="mx-auto h-8 w-8 mb-2" />
            <div>No favorite outfits found.</div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {filteredOutfits.map((favorite) =>
              isOutfitFavorite(favorite) ? (
                <OutfitCard
                  key={`outfit-${favorite.favoritable.id}`}
                  outfit={favorite.favoritable}
                  onFavorite={() =>
                    handleRemoveFavorite(favorite.favoritable.id, "outfit")
                  }
                  onDelete={() => {}}
                  isFavorited={true}
                />
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}
