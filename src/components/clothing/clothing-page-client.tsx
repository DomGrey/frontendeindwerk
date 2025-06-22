"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClothingItemCard } from "@/components/clothing/clothing-item-card";
import { ClothingItemDialog } from "@/components/clothing/clothing-item-dialog";
import {
  getClothingItems,
  createClothingItem,
  updateClothingItem,
} from "@/lib/api/clothing";
import { getFavoriteClothingItems } from "@/lib/api/favorites";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "react-toastify";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { toClothingItem } from "@/lib/utils";
import type { ClothingItem as ApiClothingItem } from "@/lib/types/api";

const categories = [
  "All",
  "Top",
  "Bottom",
  "Dress",
  "Outerwear",
  "Shoes",
  "Accessories",
];
const colors = ["All", "Red", "Green", "Blue", "White", "Black", "Yellow"];
const seasons = ["All", "Spring", "Summer", "Autumn", "Winter"];

export function ClothingPageClient() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    color: "All",
    season: "All",
  });
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const searchParams = {
        q: debouncedSearchQuery || undefined,
        category: filters.category === "All" ? undefined : filters.category,
        color: filters.color === "All" ? undefined : filters.color,
        season: filters.season === "All" ? undefined : filters.season,
      };

      const [clothingData, favoritesData] = await Promise.all([
        getClothingItems(token, searchParams),
        getFavoriteClothingItems(token),
      ]);

      setItems(
        clothingData.map((item: ApiClothingItem) => toClothingItem(item))
      );

      let favoritedIdsSet = new Set<number>();
      if (Array.isArray(favoritesData)) {
        favoritedIdsSet = new Set(favoritesData.map((fav) => fav.id));
      }
      setFavoriteIds(favoritedIdsSet);
    } catch (error) {
      console.error("Failed to fetch clothing items:", error);
      toast.error("Failed to load clothing items.");
    } finally {
      setLoading(false);
    }
  }, [token, debouncedSearchQuery, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleAddItemClick = () => {
    setSelectedItem(undefined);
    setDialogOpen(true);
  };

  const handleEditItemClick = (item: any) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (!token) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedItem) {
        const updatedItem = await updateClothingItem(
          token,
          selectedItem.id,
          formData
        );
        setItems(
          items.map((it) => (it.id === selectedItem.id ? updatedItem : it))
        );
        toast.success("Clothing item updated successfully");
      } else {
        const newItem = await createClothingItem(token, formData);
        setItems((prev) => [...prev, newItem]);
        toast.success("Clothing item added successfully");
      }
      setDialogOpen(false);
      setSelectedItem(undefined);
    } catch (error: any) {
      console.error("Failed to submit form:", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = (itemId: number, isFavorited: boolean) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (isFavorited) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const handleDeleteItem = (itemId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Clothing</h1>
          <Button onClick={handleAddItemClick}>Add Item</Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4">
          <div className="flex-grow mb-4 sm:mb-0">
            <Input
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category-filter">Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="color-filter">Color</Label>
              <Select
                value={filters.color}
                onValueChange={(value) => handleFilterChange("color", value)}
              >
                <SelectTrigger id="color-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="season-filter">Season</Label>
              <Select
                value={filters.season}
                onValueChange={(value) => handleFilterChange("season", value)}
              >
                <SelectTrigger id="season-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((sea) => (
                    <SelectItem key={sea} value={sea}>
                      {sea}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleEditItemClick(item)}
              className="cursor-pointer"
            >
              <ClothingItemCard
                item={item}
                onFavorite={(isFavorited) =>
                  handleToggleFavorite(item.id, isFavorited)
                }
                onDelete={() => handleDeleteItem(item.id)}
                isFavorited={favoriteIds.has(item.id)}
              />
            </div>
          ))}
        </div>
      )}

      <ClothingItemDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleFormSubmit}
        item={selectedItem}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
