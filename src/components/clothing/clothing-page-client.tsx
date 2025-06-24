"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
import type {
  ClothingItem,
  ClothingItemOptions,
  ClothingCategory,
  ClothingSeason,
} from "@/lib/types/api";
import {
  getClothingItems,
  createClothingItem,
  updateClothingItem,
  getClothingItemOptions,
} from "@/lib/api/clothing";
import { getFavoriteClothingItems } from "@/lib/api/favorites";
import { useAuth } from "@/lib/context/auth-context";
import { toast } from "react-toastify";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function ClothingPageClient() {
  const { token } = useAuth();
  const [allItems, setAllItems] = useState<ClothingItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState<ClothingItemOptions | null>(null);
  const [filters, setFilters] = useState<{
    category?: ClothingCategory;
    color?: string;
    season?: ClothingSeason;
  }>({});
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!token) return;
    getClothingItemOptions(token)
      .then((opts) => setOptions(opts))
      .catch(() => console.error("Failed to load options"));
  }, [token]);

  const fetchFavorites = useCallback(async () => {
    if (!token) return;
    const favoritesResponse = await getFavoriteClothingItems(token);
    let favoritedIdsSet = new Set<number>();
    if (Array.isArray(favoritesResponse.data)) {
      favoritedIdsSet = new Set(favoritesResponse.data.map((item) => item.id));
    }
    setFavoriteIds(favoritedIdsSet);
  }, [token]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const searchParams = {
        q: debouncedSearchQuery || undefined,
        category: filters.category,
        color: filters.color,
        season: filters.season,
      };
      const clothingResponse = await getClothingItems(token, searchParams);
      setAllItems(clothingResponse.data);
      await fetchFavorites();
    } catch (error) {
      console.error("Failed to fetch clothing items:", error);
      toast.error("Failed to load clothing items.");
    } finally {
      setLoading(false);
    }
  }, [token, debouncedSearchQuery, filters, fetchFavorites]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return allItems;
    return allItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allItems, searchQuery]);

  const handleFilterChange = (
    filterName: keyof typeof filters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value === "all" ? undefined : value,
    }));
  };

  const handleAddItemClick = () => {
    setSelectedItem(undefined);
    setDialogOpen(true);
  };

  const handleEditItemClick = (item: ClothingItem) => {
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
        setAllItems(
          allItems.map((it) => (it.id === selectedItem.id ? updatedItem : it))
        );
        toast.success("Clothing item updated successfully");
      } else {
        const newItem = await createClothingItem(token, formData);
        setAllItems((prev) => [...prev, newItem]);
        toast.success("Clothing item added successfully");
      }
      setDialogOpen(false);
      setSelectedItem(undefined);
    } catch (error: unknown) {
      console.error("Failed to submit form:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "An unexpected error occurred.";
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
    setAllItems((prev) => prev.filter((item) => item.id !== itemId));
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
                value={filters.category ?? "all"}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {options?.categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="color-filter">Color</Label>
              <Select
                value={filters.color ?? "all"}
                onValueChange={(value) => handleFilterChange("color", value)}
              >
                <SelectTrigger id="color-filter">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Gray">Gray</SelectItem>
                  <SelectItem value="Blue">Blue</SelectItem>
                  <SelectItem value="Red">Red</SelectItem>
                  <SelectItem value="Green">Green</SelectItem>
                  <SelectItem value="Yellow">Yellow</SelectItem>
                  <SelectItem value="Purple">Purple</SelectItem>
                  <SelectItem value="Pink">Pink</SelectItem>
                  <SelectItem value="Brown">Brown</SelectItem>
                  <SelectItem value="Orange">Orange</SelectItem>
                  <SelectItem value="Beige">Beige</SelectItem>
                  <SelectItem value="Navy">Navy</SelectItem>
                  <SelectItem value="Burgundy">Burgundy</SelectItem>
                  <SelectItem value="Teal">Teal</SelectItem>
                  <SelectItem value="Coral">Coral</SelectItem>
                  <SelectItem value="Lavender">Lavender</SelectItem>
                  <SelectItem value="Olive">Olive</SelectItem>
                  <SelectItem value="Maroon">Maroon</SelectItem>
                  <SelectItem value="Cream">Cream</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="season-filter">Season</Label>
              <Select
                value={filters.season ?? "all"}
                onValueChange={(value) => handleFilterChange("season", value)}
              >
                <SelectTrigger id="season-filter">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {options?.seasons.map((season) => (
                    <SelectItem key={season} value={season}>
                      {season === "all-year"
                        ? "All Year"
                        : season.charAt(0).toUpperCase() + season.slice(1)}
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
          {filteredItems.map((item) => (
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
